import React, {Component} from 'react';
import { connect } from 'react-redux';

import AutoComplete from 'material-ui/AutoComplete';

import AppBar from 'material-ui/AppBar';

import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import Avatar from 'material-ui/Avatar';
import PersonPin from 'material-ui/svg-icons/maps/person-pin-circle';
import RaisedButton from 'material-ui/RaisedButton';


import {SelectContact,FetchDirections} from '../ContactCard/actions.js';
import {geolocated} from 'react-geolocated';
 
 class Header extends Component {
	onSelectAutocomplete (contact) {
		
		var coords = this.props.coords;
		var pos = [coords.latitude, coords.longitude].join (",")
		this.props.dispatch (SelectContact (contact.id))
		//this.props.dispatch (FetchDirections (pos, this.props.contacts.selectedContact.addresses [0].formattedValue))
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
	render () {
		return 	<AppBar
					title={[
							<ToolbarGroup> 							>
								<AutoComplete style={{flex:1}}
									dataSource={this.props.contacts.contacts.map ((c) => {c.name = c.names [0].displayName; return c})}
									dataSourceConfig={{
										text: "name",
										value: 'id'
									}}
									onNewRequest={this.onSelectAutocomplete.bind (this)}
								/>
							</ToolbarGroup>
							]}
				>
					<ToolbarGroup>
						
							<Avatar src={this.props.profile.profile.image.url} />
						
						</ToolbarGroup>
					
				</AppBar>
	}
}

const mapStateToProps = (state) => {
    return state;
};

export default geolocated({
  positionOptions: {
    enableHighAccuracy: false,
  },
  userDecisionTimeout: 5000,
})(connect(mapStateToProps)
(Header))