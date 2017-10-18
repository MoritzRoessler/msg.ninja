import React, {Component} from 'react';
import { connect } from 'react-redux';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import {List, ListItem} from 'material-ui/List';

import {SelectContact} from './actions';
import Avatar from 'material-ui/Avatar';

import RaisedButton from 'material-ui/RaisedButton';

import Email from 'material-ui/svg-icons/communication/email';
import Phone from 'material-ui/svg-icons/communication/phone';
import Link from 'material-ui/svg-icons/content/link';
import Place from 'material-ui/svg-icons/maps/place';

import Subheader from 'material-ui/Subheader';
import TextField from 'material-ui/TextField';

import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';

import IconButton from 'material-ui/IconButton';
import AddCircle from 'material-ui/svg-icons/content/add-circle-outline';

import IconArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import IconArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';


import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import AutoComplete from 'material-ui/AutoComplete'


import ActionGrade from 'material-ui/svg-icons/action/grade';

import Snackbar from 'material-ui/Snackbar';

import {fetchContacts,fetchSkills, fetchUser, createUserFromContact, addImpression as AddImpression} from '../Contacts/actions.js'

import CardSection from '../CardSection';

import SIPCard from '../SIPCard';

import SwipableView from 'react-swipeable-views';
import {geolocated} from 'react-geolocated';
 
import muiThemeable from 'material-ui/styles/muiThemeable';

import { DragSource } from 'react-dnd';


var GoogleContacts = require('google-contacts').GoogleContacts;


const AvatarTitle = (props) => {
	var props1 = {...props}
	var props2 = {...props}
	
	var props4 = {
		textColor:"#ff5722",
		showExpandableButton:true,
		actAsExpander: true
	}
	delete props2.title;
	delete props2.subtitle;
	function onClick () {}
	return <div style={{backgroundColor:"rgba(0,0,0,.1)"}}><div style={{display:"flex", flexDirection:"row"}}>
				<div style={{display:"flex", flexDirection:"column", minHeight: "60px"}}>
					<div style={{flex:1}} />
				    	<div style={{width:"40px",maxWidth:"40px", margin: "16px"}}>
					    	<Avatar src={props.avatar} />
					    </div>
				    <div style={{flex:1}} />
				</div>
			    <CardTitle actAsExpander={true} showExpandableButton={true} style={{minWidth:"100px", flex:5,color:props.textColor, maxWidth:"calc(100vw - 228px)"}} title={<span style={{maxHeight:"36px",overflow:"hidden",color:props.textColor,display:"block", textOverflow:"ellipsis"}}>{props.title}</span>} subtitle={<span style={{overflow:"hidden",display:"block", textOverflow:"ellipsis"}}>{props.subtitle}</span>}>
			    </CardTitle> 
			    <CardTitle {...props4} style={{flex:1,width:"40px",maxWidth:"40px"}} >
			    	
			    {props2.children}
			    </CardTitle>

		    </div>
		    <div style={{display:"flex", flexDirection:"row"}}>
		    	<div style={{flex:1}} />
		    	<div style={{flex:1}}>
			    {props.content}
			    </div>
			    <div style={{flex:1}} />
		    </div>
	    </div>
}

const ItemTypes = {
	CARD: "CARD"
}


class ContactCard extends Component {
	constructor (props) {
		super (props);
		this.state = {
			slideIndex: 0
		}
	}
	componentDidMount (props) {
		
		if (this.isAuth () && !this.props.contacts.loading && !this.props.contacts.loaded ) {
			this.props.dispatch (fetchContacts (this.isAuth ()))	
			this.props.dispatch (fetchUser (this.isAuth ()))
			this.props.dispatch (fetchSkills (this.isAuth ()))

		}
	}

	createUserFromContact (contact)  {
		this.props.dispatch (createUserFromContact (contact, this.isAuth()))
	}

	isAuth () {
		return this.props.auth.jwt
	}

	getContact (id) {
		var contact = this.props.contacts.contacts.filter (function (contact) {
			return contact.id == id;
		})

		return contact [0] || null;
	}

	getCurrentContact () {

		if (this.props.userID) return this.getRelatedContact (this.getRelatedUserByID (this.props.userID)) || this.props.contact.dummy;
		return this.getContact (this.props.contactID || this.props.contact.selectedContactID) || this.props.contact.dummy
	}

	getRelatedUser (findContact) {
		var contact = findContact || this.getCurrentContact ()
		if (!contact) return null;
		return this.props.contacts.users.filter ((user) => {
			if (!contact.emailAddresses) return null;
			return contact.emailAddresses.reduce ((has, email) => {
				return has || email.value == user.email;
			}, false)
		})[0] || null;
	}

	getRelatedUserByID (id) {
		return this.props.contacts.users.filter ((user) => {
			return user.id == id;
		})[0] || null;
	}

	getRelatedContact (user) {
		return this.props.contacts.contacts.filter ((contact) => {
			if (!contact.emailAddresses) return null;
			return contact.emailAddresses.reduce ((has, email) => {
				return has || email.value == user.email;
			}, false)
		})[0]
	}
	getSkill (id) {
		return this.props.contacts.skills.filter (function (e) {
			return e.id == id;
		})[0]
	}
	getRelatedSkills (findContact) {
		var contact = findContact || this.getCurrentContact ();
		var user = this.getRelatedUser (contact);

		if (!user) return [];

		var userID  = user.id;

		var impressions = this.props.contacts.impressions.filter ((imp) => {
			return imp.to === userID;
		}).map (function (imp) {
			return {
				...imp,
				fromUser: this.getRelatedUserByID (imp.from),
				skillTitle: this.getSkill (imp.skill),
				toUser: user
			}
		}.bind (this))

		return impressions;

	}

	findSkillID (skill) {
		return (this.props.contacts.skills.filter ((s) => s.title == skill)[0] || {}).id 
	}

	addImpression (stars, a) {
		var skill = this.findSkillID (this.refs.addSkillAutocomplete.refs.searchTextField.props.value),
			contact = this.getCurrentContact (),
			user = this.getRelatedUser (contact),
			token = this.isAuth ();
		

		var fromID, toID;
		if (contact && !user) {
			return false;
		}

		if (user) {
			toID = user.id;
			fromID = this.props.auth.userID;

			return this.props.dispatch (AddImpression (fromID, toID, skill, stars, token))

		}
		return false

	}

	handleChange (index, e) {
		this.setState ({
			slideIndex: index
		})

		e.stopPropagation ();
		e.cancel ();
		return e.preventDefault ();
	}

onExpandChange (val) {
	return 0 && val || true
}

	render () {
		var contact = this.getCurrentContact();
		var user = this.getRelatedUser ();
		var that = this;
		var addSkillButton = <IconButton><AddCircle /></IconButton>
		var userSkills = this.getRelatedSkills ();

		var primaryColor = this.props.muiTheme.baseTheme.palette.primary1Color
		var accentColor = this.props.muiTheme.baseTheme.palette.accent1Color ;

		var coords = this.props.coords || {};
		var color ;
		var currentLocationItem = null;
		
    
		const { isDragging, connectDragSource } = this.props;

		if (isDragging) //return connectDragSource (<div>ASDASD</div>)

		if (!contact && !user) return
		if (user && this.props.auth.email==user.email && coords.accuracy) {
			currentLocationItem = <ListItem  style={{textAlign:"left",overflow:"hidden"}} leftIcon={<Place />} secondaryText={[coords.latitude,coords.longitude].map ((c) => c.toFixed (5)).join (", ")} primaryText="Curent" />
		}
		if (this.props.primary)
			color = primaryColor;
		else if (this.props.accent)
			color = accentColor;

		

		var slides = 3;

		var buttons = {
			iconLeft: <IconArrowLeft onTouchTap={this.handleChange.bind (this,(slides +(this.state.slideIndex - 1)) % slides)} style={{height:"48px"}} />,
			iconRight: <IconArrowRight onTouchTap={this.handleChange.bind (this,(slides +(this.state.slideIndex + 1)) % slides)} style={{height:"48px"}}/>
		}
		var card =  <Card initiallyExpanded={this.props.expanded}  style={{
			backgroundColor: "rgba(255,255,255,.7)",
			position: isDragging?"fixed":"relative"
		}}>;
		    <AvatarTitle
		      title={contact.names [0].displayName}
		      subtitle={user?user.email:contact.content}
		      avatar={contact.image}
		      actAsExpander={true}
		      showExpandableButton={true}
		      textColor={color}
		      content={
	    		<div style={{flex:1, minWidth:"250px"}}>
		    		{
		    			[1,2,3,4,5].map ((stars) => {
		    				return 	      	<ActionGrade style={{height:"20px",padding:5, marginTop: "-16px"}}   onTouchTap={that.addImpression.bind (that, stars)}/>
		    					//<IconButton style={{height:"10px"}} tooltip="bottom-right" touch={true} tooltipPosition="bottom-right"></IconButton>
		    			})
		    		}
		    	</div>
		      }
		    >

		    </AvatarTitle>



		    <CardText onExpandChange={this.onExpandChange} expandable={true} >
		    	<SwipableView
		        
		          index={this.state.slideIndex}
		          onChangeIndex={this.handleChange.bind (this)}
		        
		    	>
		    	<CardSection {...buttons} title="Info" style={{overflow:"hidden"}}>

			    	<List>
			    		 {currentLocationItem}
			    	
			    		{
			    			(contact.phoneNumbers||[]).map ((nr) => {
			    				return <ListItem  style={{textAlign:"left",overflow:"hidden"}} leftIcon={<Phone />} secondaryText={nr.formattedType} primaryText={nr.canonicalForm || nr.value} />
			    			}).concat ([<ListItem leftIcon={<Email />} secondaryText={(contact.emailAddresses||[]).length&&contact.emailAddresses[0].value} primaryText={"Emails"} nestedItems={(contact.emailAddresses||[]).map ((nr) => {
			    				var iconProps = {};
			    				if (nr.value === that.props.auth.email) 
			    					iconProps.style = {
			    						fill: "gold"
			    					}

			    				return <ListItem  style={{textAlign:"left",overflow:"hidden"}}leftIcon={<Email {...iconProps}/>} econdaryText={nr.formattedType} secondaryText={<span style={{display:"block",overflow:"hidden",textOverflow:"ellipsis"}}>{nr.value}</span>} />
			    			})}/>]).concat (
			    			(contact.addresses||[]).map ((addr) => {
			    				return <ListItem  style={{textAlign:"left",overflow:"hidden"}} leftIcon={<Place />} secondaryText={addr.city} primaryText={addr.streetAddress} />
			    			}))


			    		}
					</List>
		    	</CardSection>
			    	<CardSection {...buttons} title={"Skills"}>
				    	{this.props.contacts.skills.length==0?null:
					    	<List>

				    		{userSkills.filter ((s) => typeof s.skill == "number").map ((skill) => {
				    			return <ListItem key={skill.id} primaryText={skill.skillTitle.title} secondaryText={
				    						 [1,2,3,4,5].slice (0,skill.rating).map ((stars) => {
								    				return   	<ActionGrade style={{height:"10px"}} onTouchTap={that.addImpression.bind (that, stars)}/>
														   
								    			})
				    			} />
				    		})}

				    		<ListItem leftIcon={<AddCircle style={{height:"40px"}} />}>
				    			<AutoComplete ref="addSkillAutocomplete" hintText="Skill" dataSourceConfig={{text:"title",value:"id"}} dataSource={this.props.contacts.skills} />
				    		</ListItem>
					    	</List>
				    	}
			    	</CardSection>
			    	<CardSection {...buttons} title="Spotify">
			    		<iframe src="https://open.spotify.com/embed?uri=spotify:user:c5h8nnao4:playlist:4AVi4UogkkMI5C9vNollTf" width="100%" height="380" frameborder="0" allowtransparency="true"></iframe>
			    	</CardSection>
			    </SwipableView>
		      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
		      Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
		      Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
		      Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.

		    </CardText>
		    <CardActions>
		      {user?null:<FlatButton label="Create User" onTouchTap={this.createUserFromContact.bind (this, contact)}/>}
		      <FlatButton label="Action2" />
		    </CardActions>
	  </Card>

	  return connectDragSource(<div>{card}</div>)
	}
}

const cardSource = {
  beginDrag(props) {
    return {
      
    };
  }
};


function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}


const mapStateToProps = (state) => {
    return {auth: state.auth,
    	profile: state.profile,
    	contact: state.contact,
    	contacts: state.contacts
    }
};

export default muiThemeable()(
geolocated({
positionOptions: {
enableHighAccuracy: false,
},
userDecisionTimeout: 5000,
})(
	connect(mapStateToProps)(
DragSource(ItemTypes.CARD, cardSource, collect)(
		ContactCard
		))
)

)