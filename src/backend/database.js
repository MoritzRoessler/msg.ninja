var punycode = require ("punycode");
var simpleParser = require('mailparser').simpleParser;
var Sequelize = require('sequelize'),
    epilogue = require('epilogue'),
    http = require('http'),
    fetch = require ('node-fetch')

var utf8 = require ('utf8')
var ForbiddenError = require('epilogue').Errors.ForbiddenError;

var database = new Sequelize('postgres://postgres:postgres@localhost:5432/msgninja');

var User = database.define('User', {
  username: Sequelize.STRING,
  email: Sequelize.STRING
});

var Token = database.define('Token', {
  userID: Sequelize.STRING,
  jwt: Sequelize.STRING(10000),
  googleAccessToken: Sequelize.STRING
});

var GoogleProfile = database.define('GoogleProfile', {
  userID: Sequelize.STRING,
  googleID: Sequelize.STRING,
  profileData: Sequelize.JSON
});

var Contact = database.define('GoogleContact', {
  userID: Sequelize.STRING,
  resourceName: Sequelize.STRING,
  names: Sequelize.ARRAY(Sequelize.JSON),
  photos: Sequelize.ARRAY(Sequelize.JSON),
  phoneNumbers: Sequelize.ARRAY(Sequelize.JSON),
  emailAddresses:Sequelize.ARRAY(Sequelize.JSON),
  addresses:Sequelize.ARRAY(Sequelize.JSON),
  relations: Sequelize.ARRAY(Sequelize.JSON),
  imClients:Sequelize.ARRAY(Sequelize.JSON),
  coverPhotos: Sequelize.ARRAY(Sequelize.JSON),
  birthdays: Sequelize.ARRAY(Sequelize.JSON)
});

var Skill = database.define('Skill', {
  title: Sequelize.STRING,
  category: Sequelize.STRING
});

var SkillImpression = database.define('SkillImpression', {
  skill: { type: Sequelize.INTEGER,  unique: 'impression' },
  rating: Sequelize.INTEGER,
  to: { type: Sequelize.INTEGER,  unique: 'impression' },
  from: { type: Sequelize.INTEGER,  unique: 'impression' }
});

var Email = database.define('Email', {
  content: { type: Sequelize.STRING(10000) },
  to: { type: Sequelize.STRING(10000) },
  from: { type: Sequelize.STRING },
  data: Sequelize.JSONB
});


var File = database.define('File', {
  id: {
    type:Sequelize.STRING,
    primaryKey: true,
    unique: "id"
  },
  owner: { type: Sequelize.STRING},
  url: { type: Sequelize.STRING(1000) },
  name: { type: Sequelize.STRING},
  mimeType: { type: Sequelize.STRING},
  kind: { type: Sequelize.STRING}
});


var GoogleContacts = require('google-contacts').GoogleContacts;

// Initialize server
var server, app;
if (process.env.USE_RESTIFY) {
  var restify = require('restify');

  app = server = restify.createServer()
  app.use(restify.queryParser());
  app.use(restify.bodyParser());
} else {
  var express = require('express'),
      bodyParser = require('body-parser');

  var app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  server = http.createServer(app);
}

app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});

app.get ('/directions',function (req, res, next) {
  var url ="https://maps.googleapis.com/maps/api/directions/json?origin="+req.query.from+"&destination="+req.query.to+"&key=AIzaSyDJWb1lKQyV8JtGEHPkghKag7MJt-YJBw0"
    return fetch (utf8.encode (url)).then ((res) => res.json ()).then ((json) => res.send (json))
})

// Initialize epilogue
epilogue.initialize({
  app: app,
  base: '/api',
  sequelize: database
});

// Create REST resource
var userResource = epilogue.resource({
  model: User,
  endpoints: ['/users', '/users/:id']
});
userResource.read.auth (isAuthenticated)
userResource.list.auth (isAuthenticated)

var tokenResource = epilogue.resource({
  model: Token,
  endpoints: ['/tokens', '/tokens/:id']
});
tokenResource.read.auth (isAuthenticated)
tokenResource.list.auth (isAuthenticated)

var googleRessource = epilogue.resource({
  model: GoogleProfile,
  endpoints: ['/profiles/google', '/profiles/google/:userID']
});
googleRessource.read.auth (isAuthenticated)
googleRessource.list.auth (isAuthenticated)

var contactRessource = epilogue.resource({
  model: Contact,
  endpoints: ['/contacts', '/tokens/:id']
});
contactRessource.read.auth (isAuthenticated)
contactRessource.list.auth (isAuthenticated)

var skillRessource = epilogue.resource({
  model: Skill,
  endpoints: ['/skills', '/skills/:id']
});
skillRessource.read.auth (isAuthenticated)
skillRessource.list.auth (isAuthenticated)

var userImpressionRessource  =  epilogue.resource({
  model: SkillImpression,
  endpoints: ['/user/skills/', '/user/skills/:id']
});
userImpressionRessource.read.auth (isAuthenticated)
userImpressionRessource.list.auth (isAuthenticated)

var emailRessource  =  epilogue.resource({
  model: Email,
  endpoints: ['/emails/', '/emails/:id']
});
emailRessource.read.auth (isAuthenticated)
emailRessource.list.auth (isAuthenticated)

var emailFromRessource  =  epilogue.resource({
  model: Email,
  endpoints: ['/email/', '/email/:id']
});
emailFromRessource.read.auth (isAuthenticated)
emailFromRessource.list.auth (isAuthenticated)


var googleDriveRessource = epilogue.resource({
  model: File,
  endpoints: ['/google/drive/files/','/google/drive/files/:id']
})
googleDriveRessource.read.auth (isAuthenticated)
googleDriveRessource.list.auth (isAuthenticated)

function  getUserAndToken (req,res,context) {
          console.log ("get user and token")
         return new Promise(function(resolve, reject) {
          console.log ("calling getAutToken");
           return getAuthToken (req,res,context)
           .then(function (tok) {
               console.log ("TOKEN",tok)
                return User.findOne ({where: {id: tok.userID}}).then ((usr, err) => {
                   console.log ("HM", usr, err);
                   return resolve ({usr,tok})
                })

               
            }).then ((data) => {
                    console.log ("FOUND USER")
                    resolve (data);
            }).catch ((err) => {
                    console.log ("ERROR ", err)
                    reject (err)
            })
         })
};
googleDriveRessource.read.auth (isAuthenticated)
googleDriveRessource.read.fetch.before (function (req, res, context) {
    return new Promise ((resolve, reject) => {

      return getUserAndToken (req,res,context)
      .then ((data) => {
        var token = data.tok;
        var usr = data.usr;
        console.log ("Hm", req.params.id)
        var url = "https://www.googleapis.com/drive/v3/files/"+req.params.id+"?fields=id,contentHints/indexableText,owners,webViewLink&" + (req.query.download?"alt=media&":"")+"access_token=" + token.googleAccessToken
        console.log ("URL",url)

        if (req.query.download) {
            require('request').get(url).pipe(res)
            
            return resolve (context.stop)
                    
        }
        return fetch (url)
        .then ((res) => {
            return res.json ()})
        .then ((data) => {
               console.log ("DATA!", data)
          //context.instance = data;
          //context.instance = data;
                 res.status (200).send (data);
                  return resolve (context.stop)
          })
        return res.send ("H;");
        
      })
      .catch ((err) => {
        console.log ("ERROR", err)
        res.status(401).send({message: err});
        return resolve(context.stop);
        return res.send ("EERRRROR" + err)
      })
    })
})
googleDriveRessource.list.auth (isAuthenticated)
googleDriveRessource.list.fetch (function (req, res, context) {
  console.log ("FILES " , context)
    return File.findAll ().then (function (contacts) {
        console.log ("FOUND EXISTING FILES", contacts.length)
        if (contacts.length) {
          context.instance = contacts;
          return context.continue;
        }
        var token;
        var user;
        return getAuthToken (req,res,context).then(function (tok) {
              token = tok;
              return User.findOne ({where: {id: token.userID}}) 
         }).then (function (usr) {
              user = usr;
              console.log ("USER", user)
              var url = "https://www.googleapis.com/drive/v3/files?access_token=" + token.googleAccessToken
              console.log ("url", url)
              return
              return fetch (url)
         }).then (function (res,err) {
                  console.log ("Fetched", err, res)
                  return res.json ();
         }).then (function (data) {
              console.log (req.query.id)
               context.instance = data.files;
            return context.continue;
              var messages = data.messages;
              var fetched = [];
              console.log ("MESSAGES" + messages.length, messages [0])
              function fetchMessage (id) {
                  console.log ("FETCH " + id)
                  return fetch ("https://www.googleapis.com/gmail/v1/users/"+user.email+"/messages/"+id+"?access_token=" + token.googleAccessToken).then (function (res) {
                      return res.json ();
                  }).then (function (message) {
                      console.log ("FETCHING MESSAGE" + message.snippet)

                      fetched.push ({
                        content: message.snippet,
                        data: message
                      })

                      if (fetched.length == messages.length) {
                        return Email.bulkCreate (fetched)
                        
                      } else {
                        return fetchMessage (messages.pop ().id);
                      }
                  })
              }

              return fetchMessage (messages [0].id)
         }).then (function (messages) {
            context.instance = messages;
            return context.continue;
         })
    });
  })



emailFromRessource.list.auth (isAuthenticated)
emailFromRessource.list.fetch (function (req, res, context) {
    return Email.findAll ({where:{from: req.query.from}}).then (function (contacts) {
        console.log ("FOUND EXISTING CONTACTS", contacts.length)
        if ( false && contacts.length) {
          context.instance = [] //contacts;
          return context.continue;
        }
        var token;
        var user;
        return getAuthToken (req,res,context).then(function (tok) {
              token = tok;
              return User.findOne ({where: {id: token.userID}}) 
         }).then (function (usr) {
              user = usr;
              console.log ("USER", user)
              var url = "https://www.googleapis.com/gmail/v1/users/"+user.email+"/messages/?q="+req.query.q+"&maxResults=333&access_token=" + token.googleAccessToken
              console.log ("url", url)
              return fetch (url)
         }).then (function (res,err) {
                  console.log ("Fetched", err, res)
                  return res.json ();
         }).then (function (data) {
              var messages = data.messages
              var fetched = [];
              console.log ("MESSAGES" + messages.length, messages [0])
              function fetchMessage (id) {
                  console.log ("FETCH " + id)
                  return fetch ("https://www.googleapis.com/gmail/v1/users/"+user.email+"/messages/"+id+"?format=raw&access_token=" + token.googleAccessToken).then (function (res) {
                      return res.json ();
                  }).then (function (message) {

                      function getHeader (name, email) {
                          console.log (name,email.data)
                          var obj =  email.payload.headers.reduce ((obj, header) => {
                            obj [header.name] = header.value;
                            return obj;
                          },{})

                          console.log (obj)
                          return obj[name]
                          
                      }


                      var decoded = new Buffer(message.raw.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString("")
                      var encoded = punycode.toASCII(decoded)
                        return simpleParser(decoded).then ((mail) => {
                      console.log ("FETCHING MESSAGE", mail.text)
                            fetched.push ({
                              content: message.snippet,
                              data: mail,
                            from: mail.from.text,

                              to: mail.to.text

                            })
                        }).then (function () {

                            if (!messages.length) {
                              return Email.bulkCreate (fetched)
                              
                            } else {
                              return fetchMessage (messages.pop ().id);
                            }
                        })

                      

                  })
              }

              return fetchMessage (messages [0].id)
         }).then (function (messages) {
            context.instance = messages;
            return context.continue;
         })
    });
  })

emailRessource.list.auth (isAuthenticated)
emailRessource.list.fetch (function (req, res, context) {
  console.log ("CONTACTS " , context)
    return Email.findAll ().then (function (contacts) {
        console.log ("FOUND EXISTING CONTACTS", contacts.length)
        if (contacts.length) {
          context.instance = contacts;
          return context.continue;
        }
        var token;
        var user;
        return getAuthToken (req,res,context).then(function (tok) {
              token = tok;
              return User.findOne ({where: {id: token.userID}}) 
         }).then (function (usr) {
              user = usr;
              console.log ("USER", user)
              var url = "https://www.googleapis.com/gmail/v1/users/"+user.email+"/messages/?maxResults=333&access_token=" + token.googleAccessToken
              console.log ("url", url)
              return fetch (url)
         }).then (function (res,err) {
                  console.log ("Fetched", err, res)
                  return res.json ();
         }).then (function (data) {
              var messages = data.messages;
              var fetched = [];
              console.log ("MESSAGES" + messages.length, messages [0])
              function fetchMessage (id) {
                  console.log ("FETCH " + id)
                  return fetch ("https://www.googleapis.com/gmail/v1/users/"+user.email+"/messages/"+id+"?access_token=" + token.googleAccessToken).then (function (res) {
                      return res.json ();
                  }).then (function (message) {
                      console.log ("FETCHING MESSAGE" + message.snippet)

                      fetched.push ({
                        content: message.snippet,
                        data: message
                      })

                      if (fetched.length == messages.length) {
                        return Email.bulkCreate (fetched)
                        
                      } else {
                        return fetchMessage (messages.pop ().id);
                      }
                  })
              }

              return fetchMessage (messages [0].id)
         }).then (function (messages) {
            context.instance = messages;
            return context.continue;
         })
    });
  })

//contactRessource.list.auth (isAuthenticated)
contactRessource.list.fetch (function (req, res, context) {
  console.log ("CONTACTS " , context)
    return Contact.findAll ().then (function (contacts) {
        console.log ("FOUND EXISTING CONTACTS", contacts.length)
        if (contacts.length) {
          context.instance = contacts;
          return context.continue;
        }
        return getAuthToken (req,res,context).then(function (token) {
            var url = 'https://people.googleapis.com/v1/people/me/connections?pageSize=500&personFields=biographies,ageRanges,birthdays,imClients,relationshipStatuses,nicknames,coverPhotos,relationshipInterests,photos,relations,skills,interests,phoneNumbers,addresses,names,emailAddresses&access_token=' + token.googleAccessToken
            return fetch (url).then ((res) => res.json ()).then ((json) => {

                return Contact.bulkCreate (json.connections).then ((contacts) => {
                    console.log ("CREATED!!!", [].slice.call (contacts))
                    context.instance = contacts;
                  
                }) .then (() => {
                    return context.continue
                })
            })
         })
    });
        
})

function getAuthToken (req, res, context) {
  
    var authKey = req.query.key;
    console.log ("GET AUTH TOKEN")
    return new Promise ((resolve, reject) => {
        return Token.findOne ({
            where: {
              jwt:authKey
            }
          }).then (function (token) {
              console.log ("TOKEN",token);
              if (token)
                return resolve (token);
              return reject ({err:"Not found"})
          }).catch ((err) => {
              console.log ("ERR IN TOKEN")
              return reject ({err:err||"Hmmmm"})
          })
    })
}

function isAuthenticated (req, res, context) {
      var authKey = req.query.key;
   return Token.findOne ({
      where: {
        jwt:authKey
      }
    }).then (function (token) {
        console.log ("TOKEN",token);
        if (token)
          return context.continue;
        
        throw new ForbiddenError("Not autenticated");
        return context.error(403, "can't delete a user");
    })
}

googleRessource.read.auth(function(req, res, context) {
    console.log ("NOPE")
    
    return isAuthenticated (req, res, context)
    
    // optionally:
})
// Create database and listen
database
  .sync({ force: false })
  .then(() => Skill.bulkCreate ([{title: "Biken", category: "Sports"}, {title: "Coden", category: "Informatics"}]))
  .then(function() {
    server.listen(1234, 'localhost', function() {
      var host = server.address().address,
          port = server.address().port;

      console.log('listening at http://%s:%s', host, port);
    });
  });
