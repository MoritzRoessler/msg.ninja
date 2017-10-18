// app.js
var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);

var SIP = require ('jssip');

var state = {peerIDs: {}};

function log () {
	console.log.apply (console, arguments);
}

const ActionReducer = (state, action, client) => {
	if (action.return) return;
	switch (action.type) {
		case 'SET_PEER_ID':
			state.peerIDs [action.userID] = action.data
			console.log ("SET_PEER_ID", action.data, action.userID);
			state.result = {
				type: 'UPDATED_PEER_ID'
			}

			action.return = true;
    		io.emit ('action', action)

			return state;
		default:
			return state;
	}
}

app.use(express.static(__dirname + '/node_modules'));  
app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/index.html');
});


io.on('connection', function(client) {  
    console.log('Client connected...');

    client.on ('action', function (action) {
    	
    	ActionReducer (state, action);


    	client.emit ('action', state.result)
    })
});



server.listen(4200,"0.0.0.0"); 