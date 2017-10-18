var accountSid = 'ACb442bd15e524103cf1c1e634dcea5933'; // Your Account SID from www.twilio.com/console
var authToken = 'your_auth_token';   // Your Auth Token from www.twilio.com/console

var twilio = require('twilio');
var client = new twilio(accountSid, authToken);

client.messages.create({
    body: 'Hello from Node',
    to: '+12345678901',  // Text this number
    from: '+12345678901' // From a valid Twilio number
})
.then((message) => console.log(message.sid));