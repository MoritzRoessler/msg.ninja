import React, {Component} from 'react';
import { connect } from 'react-redux';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Contacts from '../Contacts'
import FlatButton from 'material-ui/FlatButton';


class ContactsCard extends Component {
	render () {
		return  <Card>
		    <CardHeader
		      title="Contacts"
		      subtitle={this.props.subtitle}
		      avatar=""
		    />
		    <CardText style={{overflow:"scroll", "overflow-x":"hidden", maxHeight:"250px"}}>
		     <Contacts />
		    </CardText>
		    <CardActions>
		      <FlatButton label="Action1" />
		      <FlatButton label="Action2" />
		    </CardActions>
		  </Card>
	}
}

const mapStateToProps = (state) => {
    return state.size
};

export default ContactsCard