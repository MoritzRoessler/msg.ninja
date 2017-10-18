import React, {Component} from 'react';
import { connect } from 'react-redux';

import {GridList, GridTile} from 'material-ui/GridList';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import {size} from '../../container/ResponsiveGrid/'

import Call from 'material-ui/svg-icons/communication/call'
import CallEnd from 'material-ui/svg-icons/communication/call-end'

import {answerCall} from './actions.js'

class IncominCallNotification extends Component {
	constructor (props) {
		super (props)
		this.state = {
			time: 0
		}
	}

	componentDidUpdate () {
		if (this.isCallRunning ()) {
			var time = +new Date-this.props.peer.active;
			var d = new Date;
			d.setTime (time );

			setTimeout (this.setState.bind (this, {time: d.toLocaleString ().slice (-8,-3)}), 1000)
		}
	}
  	getContact (id) {
		var contact = this.props.contacts.contacts.filter (function (contact) {
			return contact.id == id;
		})

		return contact [0] || null;
	}

	getCurrentContact () {
		return this.getContact (this.props.contactID || this.props.contact.selectedContactID) || this.props.contact.dummy
	}

	getRelatedUser (findContact) {
		var contact = findContact || this.getCurrentContact ();
		return this.props.contacts.users.filter ((user) => {
			return !!~contact.email.indexOf (user.email)
		})[0] || null;
	}

	getRelatedUserByID (id) {
		return this.props.contacts.users.filter ((user) => {
			return user.id == id;
		})[0] || null;
	}

	getUser () {
		var isCallIncoming = this.isCallIncoming ()
		return this.getRelatedUserByID (isCallIncoming) || {title:"Unbekannt", email:"no@e.mail"}
	}
	getName () {
		return this.getUser ().title
	}

	getEmail () {
		return this.getUser().email
	}

	getCardProps () {
		return {
			subtitle:this.isCallIncoming()?this.getEmail ():this.state.time,
			title: this.isCallIncoming()?"Incoming Call from ":"Call with" + (this.getName () || "Unbekannt")
		}
	}

	isCallIncoming () {
		return this.props.peer.caller.callingID && this.props.peer.call && !this.props.peer.stream
	}

	isCallRunning () {
		return this.props.peer.stream && this.props.peer.active;
	}
	answer () {
		this.props.peer.call.answer ();
		this.props.dispatch (answerCall ());
	}

	hangup () {
		
		this.props.peer.call.close ();
		this.props.dispatch ({
			type: 'HANGUP_CALL'
		})
	}
	render () {
		var isCallIncoming = this.isCallIncoming ()
		var props = {title: "Incoming call"};

		if (!isCallIncoming && !this.isCallRunning ()) {

			props.style = {
				display: 'hidden'
			}
			return <div />
		}

		return <GridTile  cols={this.props.cols}>
			<Card>
				<CardTitle {...this.getCardProps ()}/>
				<CardActions>
					{this.isCallIncoming()?<FlatButton onTouchTap={this.answer.bind (this)} primary={true} label="Accept" icon={<Call/>}/>:[]}
					<FlatButton onTouchTap={this.hangup.bind (this)} secondary={true} label={this.isCallRunning()?"Hangup":"Decline"} icon={<CallEnd/>}/>
				</CardActions>
			</Card>
		</GridTile>
	}
}

const mapStateToProps = (state) => {
    return state
};

export default connect(mapStateToProps)
(IncominCallNotification)