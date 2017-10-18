import React, {Component} from 'react';
import { connect } from 'react-redux';
import {setPeerID, updatePeerID, callIncoming} from './actions'

import Peer from 'peerjs'

class SIPCard extends Component {
	componentDidMount () {
		const socket = io.connect('http://127.0.0.1:4200');
		var peer = new Peer({key: 'lwjd5qra8257b9'});

		window.peer = peer; 

		this.state = {
			peer: peer
		}

		socket.on ('connect', function (data) {
			
		})

		socket.on ('action', function (data) {
			
			
			this.props.dispatch (data);
		}.bind (this))
		peer.on('open', function(id) {
		  var action = setPeerID (id,this.props.auth.userID);
		  
		  socket.emit ("action", action)
		  	this.props.dispatch (action)
		}.bind (this));

		peer.on('connection', function(conn) { 
			
			conn.on('open', function() {
				
					  // Receive messages
				  conn.on('data', function(data) {
				    
				  });

				  // Send messages
				  conn.send('Hello!');
			});
		 });


         var that = this;
         peer.on ('call' , function (call) {
         	
    	
				that.props.dispatch (callIncoming (null, call))
         	call.on ('stream', function (stream) {	
         		that.props.dispatch (callIncoming (stream, call))
         		
    	

         	}) 
		})
	}

	componentDidUpdate () {
		var video = document.querySelector('video');
		if (this.props.peer.stream instanceof MediaStream) {
				 video.srcObject = this.props.peer.stream;
		         video.onloadedmetadata = function(e) {
		           video.play();
		         };}
		else 
				 video.srcObject = null
	}

	call () {
		var that = this;
		var id = that.props.contacts.selectedUserID


		navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia;

 		if (navigator.getUserMedia) {
		   navigator.getUserMedia({ audio: true, video: { width: 1280, height: 720 } },
		      function(stream) {
		      	
    
				that.state.peer.call(that.props.peer.peerID [id],stream, {
					metadata: {
						userID: that.props.contacts.selectedUserID,
						callingID: that.props.auth.userID
					}
				});
		      },
		      function(err) {
		         
		      }
		   );
		} else {
		   
		}
		
	}
	render () {
		console.warn ("DISPLAYING PEER ID ", this.props.contacts.selectedUserID, "WHICH IS", this.props.peer.peerID[this.props.contacts.selectedUserID], " FROM IDS ", this.props.peer.peerID )
		return <div style={{padding: "16px"}}>
			{this.props.peer.peerID [this.props.contacts.selectedUserID]}

			<video style={{width: "100%"}}></video><button onTouchTap={this.call.bind (this)} /> </div>
	}
}

const mapStateToProps = (state) => {
    return state
};

export default connect(mapStateToProps)
(SIPCard)