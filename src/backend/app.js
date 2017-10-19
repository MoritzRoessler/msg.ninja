var authConfig = require('./config/auth'),
  express = require('express'),
  passport = require('passport'),
  GoogleStrategy = require('passport-google-auth').Strategy,
  bodyParser = require('body-parser'),
  fetch = require ("node-fetch"),
  jwt = require ("jwt-simple")

var CONFIG = require ('../config.js');
// Passport session setup.
//
//   For persistent logins with sessions, Passport needs to serialize users into
//   and deserialize users out of the session. Typically, this is as simple as
//   storing the user ID when serializing, and finding the user by ID when
//   deserializing.
passport.serializeUser(function(user, done) {
  // done(null, user.id);
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  // Users.findById(obj, done);
  done(null, obj);
});

const HEADERS = {
  JSON: {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json'
  }
}

function findOrCreateUserForEmail (email, name) {
    return fetch ("http://localhost:1234/users/?email="+email).then (function (res) {
          return res.json ()
      }).then (function (json) {
        console.log ("USER", json)
          if (json.length === 0) {
              var user = {
                email: email,
                username: name
              };

             return  fetch ("http://localhost:1234/users/", 
                    {method: 'POST', 
                    headers: HEADERS.JSON,
                    body: JSON.stringify (user)}
                    ).then (function (res) {
                        return res.json ()
                   });
          } else {
              return {
                then: function (cb) {
                    cb (json [0])
                }
              }
          }

      })
}

function createProfileForUser (user, profile) {
    return fetch ("http://localhost:1234/profiles/google/?userID="+user.id).then (function (res) {
        return res.json ();
    }).then (function (json) {
         console.log ("PROFILE", json, profile)

          if (json.length === 0) {
            var google = {
              userID: user.id,
              googleID: profile.id,
              profileData: profile
            }
            return  fetch ("http://localhost:1234/profiles/google", {
                method: 'POST', 
                headers: HEADERS.JSON,
                body: JSON.stringify (google)
              }).then (function (res) {
                return {
                        then: function (cb) {
                            cb (user)
                        }
                      }
              });
          } else {
            return {
              then: function (cb) {
                  cb (user)
              }
            }
          }
    })
}

function createTokenForUser (user, accessToken) {
    return fetch ("http://localhost:1234/tokens/?userID="+user.id).then (function (res) {
          return res.json ()
      }).then (function (json) {
        console.log ("TOKEN", json)
          if (json.length === 0) {
              var token = {
                userID: user.id,
                displayName: user.username,
                email: user.email,
                expiresAt: +new Date + 1000 + 120
              },
              encoded = jwt.encode (token, "SECRET_HIDDEN"),
              body = {
                userID: user.id,
                email: user.email,
                googleAccessToken: accessToken,
                jwt: encoded
              }

             return  fetch ("http://localhost:1234/tokens/", 
                    {method: 'POST', 
                    headers: {
                      'Accept': 'application/json, text/plain, */*',
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify (body)}
                    ).then (function (res) {
                        return res.json ()
                   });
          } else {
              return {
                then: function (cb) {
                    cb (json [0])
                }
              }
          }

      })
}
// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
//   See http://passportjs.org/docs/configure#verify-callback
passport.use(new GoogleStrategy(

  // Use the API access settings stored in ./config/auth.json. You must create
  // an OAuth 2 client ID and secret at: https://console.developers.google.com
  authConfig.google,

  function(accessToken, refreshToken, profile, done) {

    // Typically you would query the database to find the user record
    // associated with this Google profile, then pass that object to the `done`
    // callback.
      
    return  findOrCreateUserForEmail (profile.emails [0].value, profile.displayName).then (function (user) {
          return createTokenForUser (user, accessToken);
      }).then (function (user) {
        return createProfileForUser(user, profile)
      }).then (function (token) {
        //Now that we have a token, let's authenticate that user
        console.log ("TOOOOKEN", token)
        
            profile.accessToken = accessToken;
             return done(null, token);
      })
    
  }
));


// Express 4 boilerplate

var app = express();
app.set('view engine', 'hbs');

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');

app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser(bodyParser.urlencoded({ extended: false })));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/public'));


// Application routes

app.get('/', function(req, res) {
  res.render('index', {
    user: req.user
  });
});

app.get('/login', function(req, res) {
  res.render('login', {
    user: req.user
  });
});

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/drive.metadata','https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/drive.appdata', 'https://www.googleapis.com/auth/drive','https://www.googleapis.com/auth/gmail.readonly','https://www.google.com/m8/feeds/','https://www.googleapis.com/auth/contacts.readonly','openid email profile'] }));

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/google/callback',

  passport.authenticate('google', {
    failureRedirect: '/login'
  }),
  function(req, res) {
    // Authenticated successfully
    console.log ("Authenticated", req.user)
    res.redirect(CONFIG.AUTH_RETURN_URL + '#/auth?jwt=' + req.user.jwt);
    
  });

app.get('/account', ensureAuthenticated, function(req, res) {
  res.render('account', {
    user: req.user
  });
});

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.listen(process.env.PORT || 1235, function() {
  console.log("Listening...");
});


// Simple route middleware to ensure user is authenticated.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}
