import React, {Component} from 'react';
import { connect } from 'react-redux';
import MapComponent from '../MapComponent';

import {geolocated} from 'react-geolocated';
 
class Map extends Component {
	render () {
		 var prop = {}

    
	if (this.props.coords !== null) {
		prop = {
			coords: {
				lat: this.props.coords.latitude,
				lng: this.props.coords.longitude
			}
		}
	}
		  return <MapComponent
							  coords = {this.props.coords}
							  isMarkerShown
							  googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDJWb1lKQyV8JtGEHPkghKag7MJt-YJBw0&v=3.exp&libraries=geometry,drawing,places"
							  loadingElement={<div style={{ height: `100%` }} />}
							  containerElement={<div style={{ height: `100vh`, width:'100vw',zIndex:-1, position:"fixed",top:"0px"  }} />}
							  mapElement={<div ref="map" style={{minHeight: "100vh",maxHeight:"200vh", width: '100vw'}} />}
							  {...prop}
							  directions={this.props.contacts.directions}
						/>
	}
}

const mapStateToProps = (state) => {
    return state
};

export default geolocated({
positionOptions: {
enableHighAccuracy: false,
},
userDecisionTimeout: 5000,
})(connect(mapStateToProps)
(Map))