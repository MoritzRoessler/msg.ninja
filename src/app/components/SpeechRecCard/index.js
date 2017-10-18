import React, {Component} from 'react';
import { connect } from 'react-redux';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import {foundContacts,setTranscript} from './actions';

const getEditDistance = function(a, b){
  if(a.length == 0) return b.length; 
  if(b.length == 0) return a.length; 

  var matrix = [];

  // increment along the first column of each row
  var i;
  for(i = 0; i <= b.length; i++){
    matrix[i] = [i];
  }

  // increment each column in the first row
  var j;
  for(j = 0; j <= a.length; j++){
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for(i = 1; i <= b.length; i++){
    for(j = 1; j <= a.length; j++){
      if(b.charAt(i-1) == a.charAt(j-1)){
        matrix[i][j] = matrix[i-1][j-1];
      } else {
        matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                                Math.min(matrix[i][j-1] + 1, // insertion
                                         matrix[i-1][j] + 1)); // deletion
      }
    }
  }

  return matrix[b.length][a.length];
};

var lastNext = 0;
var lastCurrent = ""
class SpeechRecCard extends Component {
	constructor () {
		super ()
		this.state = {
			running: false,
			transcript: "asd",
			timeout: 5,
			contacts : []
		}
	}
	componentDidMount () {

		if (!('webkitSpeechRecognition' in window))
			return <div>Not Supported</div>
		
		  var recognition = new webkitSpeechRecognition();
			  recognition.continuous = true;
			  recognition.interimResults = true;

		  recognition.onstart = function() {
		  		this.setState ({timeout: 5})
		  		 var countdown = function (n) {
			  		  		this.setState ({
			  		  			timeout: this.state.timeout-1
			  		  		})
			  		  		if (this.state.timeout > 0) {
			  		  			setTimeout (countdown, n,n);
			  		  		} else {
			  		  			recognition.stop ();
			  		  			final_transcript = ""
			  		  			this.props.dispatch (setTranscript ())
			  		  			setTimeout (function () {
			  		  				recognition.start ();
			  		  			}, 500)
			  		  		}
			  		  
		  		 }.bind (this)

  		 		//countdown (1000)
		  }.bind (this)

		  	var err = 3;
		    recognition.onerror = function(event) {
		    	console.error (event.error)
		    	recognition.stop ();
		    	this.componentDidMount ()
    		}.bind (this)


		  recognition.onend = function() {
		  };

		  var final_transcript = '';
		  var timeout;
		  recognition.onresult = function(event) {
		  	if (timeout) clearTimeout (timeout);
		  	timeout = setTimeout (()=>{
		  		this.props.dispatch (setTranscript ())	;
		  		final_transcript = "";
		  		recognition.stop ();
		  		setTimeout (()=> {
			  		this.componentDidMount ()
			  },100)
		  	}, 5000)
		    var interim_transcript = '';
		    for (var i = event.resultIndex; i < event.results.length; ++i) {
		      if (event.results[i].isFinal) {
		        final_transcript += event.results[i][0].transcript;
		      } else {
		        interim_transcript += event.results[i][0].transcript;
		      }
		    }
		     	this.props.dispatch (setTranscript (event.results[i-1][0].transcript,interim_transcript, final_transcript))

		   	this.setState ({timeout: 3, transcript: interim_transcript})
		   	this.parseSpeech (interim_transcript,final_transcript);
		  }.bind (this)

		  this.setState ({timeout: 3, transcript: final_transcript})

		  recognition.lang = "de-DE"
  		  recognition.start();

  		 
	}

	parseSpeech (current, all) {
		console.log ("wow", all,current,lastCurrent)
	if (lastCurrent !== "next" && this.props.speech.contacts.length && getEditDistance ("nächster", current) < 3 || getEditDistance ("vor", current) && (+new Date - lastNext > 2500)) {
			console.log ("Next user ", this.props.speech.contacts, this.props.speech.index)
			 lastNext = +new Date;
			 lastCurrent = "next";
			return this.props.dispatch (foundContacts (this.props.speech.contacts, this.props.speech.index + 1))
		} else if (getEditDistance ("nächster", current) < 4 || getEditDistance ("nächster", all) < 4) {
				lastCurrent = "next";	
				return console.log (all)
		}

		if (current == lastCurrent) return
		lastCurrent = current

		var contacts = this.props.contacts.contacts;

		var filtered = [current, all].reduce ((contact,name) => {
			var c =  contact.concat (contacts.filter (function (contact) {
				const {displayName, givenName, surName} = contact.names [0];
				var list = [displayName, givenName, surName]
				return list.reduce ((mat, portion) => {
					if (!name || !portion) return mat || false
					var distance = getEditDistance (name || "", portion || "")
					return mat || distance < 2;
				}, false)
			}))
			console.log ("Found Contact " , c)
			return c;
		}, [])
		debugger
		var contact = filtered.length && filtered [0];
		if (contact) {

			console.log ("parseSpeech",filtered)
			this.props.dispatch (foundContacts (filtered, 0))
		}


	}
	render () {
		console.log (this.props)
		if (!('webkitSpeechRecognition' in window))
			return <div>Not Supported</div>

		return this.props.speech.transcript.all||this.props.speech.transcript.current?<Card><CardTitle subtitle={"00:0" + this.state.timeout} title={this.props.speech.transcript.all } subtitle={this.props.speech.transcript.current}/></Card>:null
	}
}

const mapStateToProps = (state) => {
    return state
};

export default connect(mapStateToProps)
(SpeechRecCard)