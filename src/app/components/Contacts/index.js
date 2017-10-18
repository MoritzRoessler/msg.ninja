import React, {Component} from 'react';
import { connect } from 'react-redux';
import {fetchContacts, createUserFromContact } from './actions'

import {List, ListItem} from 'material-ui/List';

import {
  Router as Router,
  Route,
  IndexRoute,
  Link,
  Redirect
} from 'react-router-dom'

import querystring from 'query-string'

class Auth extends Component {
	componentDidMount () {
		var token = this.props.auth.jwt
		if (token && !this.props.contacts.loading && !this.props.contacts.loaded ) {
			this.props.dispatch (fetchContacts (token))
		}
	}

	render () {
			return <List> {this.props.contacts.contacts.filter ((c) => c.title || c.phone.length).map ((contact) => {
				return <ListItem primaryText={contact.title} secondaryText={contact.phone.join (", ")}/>
			})} </List>
	} 
}

const mapStateToProps = (state) => {
    return state
};

export default muiThemeable()(connect(mapStateToProps)
(Auth))