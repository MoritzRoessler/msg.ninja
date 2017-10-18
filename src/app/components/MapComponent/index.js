import React, {Component} from 'react';
import { connect } from 'react-redux';

import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import {geolocated} from 'react-geolocated';
import { DirectionsRenderer } from "react-google-maps";


class MapComponent extends Component {
		constructor (props) {
			super (props);

			this.state = {
				directionsForUser: -1
			}
		}
	    renderDirection () {
	    	var selectedContact = this.props.contacts.selectedContact;
	    	var address = (selectedContact && selectedContact.addresses || [{}])[0].formattedValue 
	    	if (this.props.contacts.selectedContact && address) {

    	var that = this;
      const DirectionsService = new google.maps.DirectionsService();
      
    
      DirectionsService.route({
        origin: new google.maps.LatLng(47.99971, 7.79562),
        destination: address,
        travelMode: google.maps.TravelMode.DRIVING,
      }, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
        	
    
          that.props.dispatch ({
            type: "SET_DIRECTIONS",
            contact: selectedContact,
            data: result
          });
    		that.setState ({
    			directionsForUser: selectedContact.id
    		})

        } else {
          console.error(`error fetching directions`, result);
        }
      });
  		}
    }

    componentDidUpdate () {
    	var selectedContact = this.props.contacts.selectedContact;
    	if (selectedContact && this.state.directionsForUser !== selectedContact.id) {
    	
    
    		this.renderDirection ()
    	}
    }
    componentDidMount () {
    	this.renderDirection ()
    }
	render () {
		var props = this.props;
		var coords = props.coords;
		 var pos = coords
		 var map =  <GoogleMap
		    defaultZoom={15}
		    ref="test"
		    defaultCenter={pos}
		  >
		    {props.isMarkerShown && <Marker position={pos} />}
			<DirectionsRenderer directions={props.directions} />
		  </GoogleMap>

		  
		  return map
	}
}

const mapStateToProps = (state) => {
    return state
};

export default withScriptjs(withGoogleMap(
connect(mapStateToProps)(MapComponent)
))