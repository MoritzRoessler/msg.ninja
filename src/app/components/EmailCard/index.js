import React, {Component} from 'react';
import { connect } from 'react-redux';

import {List, ListItem} from 'material-ui/List';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import {fetchEmails, fetchUserEmails} from './actions'

import Email from 'material-ui/svg-icons/communication/email';

import SwipableViews from 'react-swipeable-views';

import Dialog from 'material-ui/Dialog';

import muiThemeable from 'material-ui/styles/muiThemeable';

import FlatButton from 'material-ui/FlatButton';

function page (arr,n) {
	return arr.reduce ((arr, e, i ) => {
		return i%n?arr[0].push(e)&&arr:[[e]].concat(arr)
    }, []).reverse ()
}
class EmailCard extends Component {
	constructor (props) {
		super (props)
		this.state = {
			slideIndex: 0,
			open: false,
			selected: 0
		}
	}
	componentDidMount () {
		var contact = this.props.contacts.selectedContact
		if (!contact) return 
		var email = (contact.emailAddresses || []).map ((e) => e.value)
		var token = this.props.auth.jwt;
		if (email.length && token && !this.props.email.user[email] && !this.props.email.fetching) {
			
    
			this.props.dispatch (fetchUserEmails (token, email))
		}
	}
	componentDidUpdate () {
		var contact = this.props.contacts.selectedContact
		if (!contact) return 
		var email = (contact.emailAddresses || []).map ((e) => e.value)
		var token = this.props.auth.jwt;
		if (email.length && token && !this.props.email.user[email] && !this.props.email.fetching) {
			debugger;
			this.props.dispatch (fetchUserEmails (token, email))
		}
	}

	getHeader (name, email) {
		return email.data.payload.headers.reduce ((obj, header) => {
			obj [header.name] = header.value;
			return obj;
		},{})[name]
		
	}

	handleChange (value) {
		this.setState ({
			slideIndex: value
		})
	}

	handleClose () {
		this.setState ({
			open: false
		})
	}

	render () {
		var that = this;
		var user = this.props.contacts.selectedContact;
		console.warn ("THEME",this.props.muiTheme)
		var emails = user && user.emailAddresses;
		if (!emails) return <div/>


		var userMails = this.props.email.user [emails[0].value] ||[];
		if (!userMails.length) return <div/>


		var setState = this.setState.bind (this);
		var selectedId = this.state.selected;
		var actions = [
			<FlatButton title="Close" onTouchTap={this.handleClose.bind (this)}>Close</FlatButton>
		]
		var selectedMail = userMails.filter ((e) => {
			console.log ("Selected ", selectedId, e.data.id, e.data.id == selectedId)
			return e.data.messageId == selectedId;
		}).map (function (e) {
			var data = e.data.textAsHtml

			return {
				body: data
			}

		})[0] || {body:""}
		console.log (selectedMail, "Hm")

		return <Card style={{backgroundColor:"rgba(255,255,255,.87)"}}>
			<a>{user.email}</a>
			<SwipableViews
					slideIndex={this.state.slideIndex}
					onChangeIndex={this.handleChange}
				> 
					{page ([].slice.call (userMails).reverse (), 5).map ((pg)=> {

						return <List className="test" style={{ maxHeight:"100%",overflow:"hidden"}}>
								{pg.map((e) => {
									var fr = e.from;
									var sub = e.data.subject;
									var isFrom = !!~user.emailAddresses[0].value.indexOf (e.data.from.value [0].address);
									console.log ("isFrom", e.data.from.value [0].address, user.emailAddresses[0].value)
									var isFlipped = isFrom ^ ~~this.props.flipflip;
									return <ListItem style={{transform:isFlipped?"":"scale(-1, 1)"}}
													 onTouchTap={() => setState ({selected: e.data.messageId, open: true})}
													 leftIcon={<Email style={{fill:this.props.muiTheme.baseTheme.palette[isFrom?"primary1Color":"accent1Color"]}}/>} 
													 secondaryTextLines={1} 
													 primaryText={<div style={{transform:isFlipped?"":"scale(-1, 1)"}}>
													 	{sub}
												 	</div>} 
													 secondaryText={<div style={{transform:isFlipped?"":"scale(-1, 1)"}}>
													 	{e.content}
												 	</div>}
										     />
								})}
							</List>
					})}
			</SwipableViews>
        <Dialog
          title="Dialog With Actions"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
          
        >
          <div dangerouslySetInnerHTML={{ __html: selectedMail&&selectedMail.body}} />
        </Dialog>
		</Card>
	}
}

const mapStateToProps = (state) => {
    return state
};

export default muiThemeable()(connect(mapStateToProps)
(EmailCard))