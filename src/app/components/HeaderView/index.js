import React, {Component} from 'react';
import { connect } from 'react-redux';

import {Tabs, Tab} from 'material-ui/Tabs';
// From https://github.com/oliviertassinari/react-swipeable-views
import SwipeableViews from 'react-swipeable-views';

import Avatar from 'material-ui/Avatar';
import PersonPin from 'material-ui/svg-icons/maps/person-pin-circle';
import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';
import ResponsiveGrid from '../../container/ResponsiveGrid'
import {GridTile} from 'material-ui/GridList';
import Divider from 'material-ui/Divider';

import ProfileCard from '../ProfileCard';
import ContactCard from '../ContactCard';
import MAP from '../Map';
import IncominCallNotification from '../IncominCallNotification';
import Header from '../Header';
import RelationShipCard from '../RelationShipCard';
import EmailCard from '../EmailCard'

import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import {geolocated} from 'react-geolocated';

import SIPCard from '../SIPCard'
const TITLE = 'Hello';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import {size} from '../../container/ResponsiveGrid/';
import {
  Router as Router,
  Route,
  IndexRoute,
  Link,
  Redirect
} from 'react-router-dom'

import SpeechRecCard from '../SpeechRecCard'

import CONFIG from '../../../config.js'
const HEIGHT = "calc(100vh-8px)"
import { DirectionsRenderer } from "react-google-maps";


const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
  slide: {
    padding: 10,
  },
};

class HeaderView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      slideIndex:  0,
    };
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

  handleChange = (value) => {
    this.setState({
      slideIndex:  value,
    });
  };

  nextSlide () {
  	this.setState ({
  		slideIndex: this.state.slideIndex + 1
  	})
  }
	render () {
		
		var cardSize = size (this.props.size)
		var cols = cardSize<=8?cardSize:3;
		var slideIndex = typeof this.props.slideIndex=="number"?this.props.slideIndex: this.state.slideIndex;


		if (!this.props.auth.jwt && slideIndex == 3) return <Redirect to="/home"/>

			return (
		      <div className="container" style={{overflow:"hidden",height:HEIGHT}}>
		        <Tabs
		          onChange={this.handleChange}
		          value={slideIndex}
		          style={{display:"none"}}
		        >
		          <Tab label="Tab One" value={0} />
		          <Tab label="Tab Two" value={1} />
		          <Tab label="Tab Three" value={2} />
		        </Tabs>
		        <SwipeableViews
		          index={slideIndex}
		          onChangeIndex={this.handleChange}
		          className="swipe"
		          style={{overflow:"unset", maxHeight:"calc(100vh - 16px)"}}
		        >
				<Link to="/login" style={{textDecoration:"none", color:"black"}}>
					<div style={{height:"calc(100vh - 16px)",display:"flex", flexDirection:"column"}} onTouchTap={this.nextSlide.bind (this)}>

					<div style={{flex:1}} />
					<div style={{fontSize:20}}>"Don't worry, be happy!"</div>
					<div style={{flex:1}} />
					</div>
				</Link>
				<div style={{maxHeight:"calc(100vh - 16px)",display:"flex", flexDirection:"column"}}>
		          	<div style={{flex:2}} />


		          	
		            <div style={{fontSize:20, textAlign:"center"}}>
		            	<div style={{maxHeight:"calc(100vh - 16px)",display:"flex", flexDirection:"row"}}>
		            		<div style={{flex:1}} />
		            		<div style={{flex:1}}>
					             <div style={{width:"100%", display:"flex", flexDirection: "column"}}>
					             	<div style={{flex:1}}/>
					             	<div style={{width:"100%", display:"flex", flexDirection: "row"}}>
					             		<div style={{flex:1, textAlign:"right"}}>
											<Avatar style={{margin:"32px", marginLeft:this.props.auth.jwt?"64px":"32px"}} className={this.props.auth.jwt?"":"bounce"} icon={<PersonPin style={{borderColor:'grey'}}/>}/>
										</div>
										<div style={{flex:1, textAlign: "left", paddingTop:"44px"}}>
											<span style={{margin:"32px" }}>
												{this.props.auth.displayName||"Hello"}
											</span>
										</div>
								 	</div>
									<Divider style={{maxWidth: "100vh" ,transform: "rotate(90deg)"}}/>
								 	
								 	<div style={{flex:2, margin:"calc(50px - 18px)"}}>

										{this.props.auth.jwt
											?<RaisedButton style={{left:"0px", display:"inline-flex", alignItems:"center", justifyContent:"center"}} href={CONFIG.AUTH_URL} title="Login...">Logout</RaisedButton>
											:<RaisedButton style={{left:"0px", display:"inline-flex", alignItems:"center", justifyContent:"center"}} href={CONFIG.AUTH_URL} title="Login...">Login</RaisedButton>
										}
									</div>
									<div style={{flex:1}}/>
					             </div>
					        </div>
		            		<div style={{flex:1}} />
			             </div>
		            </div>
		            <div style={{flex:2}} />
	          </div>
	          	<div style={styles.slide}>
		            Authenticated
		          </div>
		        <div style={{height:"100vh", overflow:"scroll"}}>

		        		<Header />
						<ResponsiveGrid style={{maxHeight:HEIGHT,padding:"8px"}}>
							{[
								<GridTile pos={cols==8?-2:1} cols={cols==8?4:cols}>
									{this.props.contacts.selectedContactID&&<ContactCard expanded={cardSize>8} primary={true} subtitle={this.props.contacts.contacts.length + " contacts"}/>||null}
								</GridTile>,
								<GridTile pos={cardSize<=8?-1:0} cols={cardSize<=8?cardSize:cols*2}>
									<ResponsiveGrid style={{maxHeight:HEIGHT, margin: "0px", padding: "0px"}}>
										{this.props.peer.stream&&<GridTile cols={cardSize}><IncominCallNotification cols={cardSize}/></GridTile>||[]}
										{this.props.peer.stream&&<GridTile pos={-2} cols={cardSize}><Card><SIPCard /></Card></GridTile>||[]}
										{this.props.speech.current&&<GridTile cols={cardSize}><SpeechRecCard /></GridTile>||[]}
										<GridTile cols={cardSize}><RelationShipCard /></GridTile>
										<GridTile cols={cardSize}><EmailCard flipflip={true}/></GridTile>
									</ResponsiveGrid>
								</GridTile>,
								<GridTile pos={cols==8?-2:-1} cols={cols==8?4:cols}>
									<ContactCard expanded={cardSize>8} accent={true} userID={this.props.auth.userID} subtitle={this.props.contacts.contacts.length + " contacts"}/>
								</GridTile>

							].sort ((a,b)=>a.props.pos-b.props.pos)}
						</ResponsiveGrid>

						<MAP/>

		          </div>
		        </SwipeableViews>
		      </div>)
	}
}

const mapStateToProps = (state) => {
    return state
};

export default connect(mapStateToProps)(HeaderView)