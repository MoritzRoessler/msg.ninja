import React, {Component} from 'react';
import { connect } from 'react-redux';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import {List, ListItem} from 'material-ui/List';

import {FetchProfile} from './actions';
import Avatar from 'material-ui/Avatar';

import RaisedButton from 'material-ui/RaisedButton';

import Email from 'material-ui/svg-icons/communication/email';

var GoogleContacts = require('google-contacts').GoogleContacts;


const AvatarTitle = (props) => {
	return <div style={{display:"flex", flexDirection:"row"}}>
 	<div style={{width:"40px" ,paddingTop:"24px", margin: "16px"}}>
			   			    	<Avatar src={props.avatar} />
			    </div>
			    <CardTitle style={{flex:5}} title={props.title} subtitle={props.subtitle}>
			    </CardTitle>
		    </div>
}
class ProfileCard extends Component {
	componentDidMount (props) {
		if (this.props.auth.jwt && !this.props.profile.loaded && !this.props.profile.loading)
			this.props.dispatch (FetchProfile (this.props.auth.userID, this.props.auth.jwt));
	}

	render () {
		if (this.props.profile.loading) return <Card title="Loading" />

		return  <Card>
		    <AvatarTitle
		      title={this.props.profile.profile.displayName}
		      subtitle={this.props.profile.profile.occupation}
		      avatar={this.props.profile.profile.image.url}
		    />

		    
		    <CardText>
		    	<List>
		    		{
		    			this.props.profile.profile.emails.map ((email) => {
		    				return <ListItem leftIcon={<Email />} primaryText={email.value} />
		    			})
		    		}
		    	</List>
		      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
		      Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
		      Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
		      Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
		    </CardText>
		    <CardActions>
		      <FlatButton label="Action1" />
		      <FlatButton label="Action2" />
		    </CardActions>
	  </Card>
	}
}

const mapStateToProps = (state) => {
    return {auth: state.auth,
    	profile: state.profile}
};

export default connect(mapStateToProps)
(ProfileCard)