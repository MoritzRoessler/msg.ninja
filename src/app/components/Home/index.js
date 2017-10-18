import React, {Component} from 'react';
import {connect} from 'react-redux';





import Avatar from 'material-ui/Avatar';
import PersonPin from 'material-ui/svg-icons/maps/person-pin-circle';
import RaisedButton from 'material-ui/RaisedButton';

import GoogleLogin from 'react-google-login';

import HeaderView from '../HeaderView';

import Auth from '../Auth';

import {
  Router as Router,
  Route,
  IndexRoute,
  Link
} from 'react-router-dom'

import { withRouter } from 'react-router'

const responseGoogle = (response) => {
	
    
  
}




/** The HHome Page*/
class Home extends Component {
	componentDidMount () {
		var that = this;

		window.addEventListener ('scroll', function () {
			if (document.body.getBoundingClientRect ().top < - 50) {

				that.setState ({
					closed:true
				})
			} else if (that.state.closed !== 2 && document.body.getBoundingClientRect ().top > 50) {
				that.setState ({
					closed:2
				})
			} else if (that.state.closed === 2) {
				that.setState ({
					closed: false
				})
			}
			
		})
	}
/**
     * The Landing Page.
     * @return {React.Element} 
     */
	render() {
		var that=this;
		var coords = this.props.coords || {}
		var closed = (that.state || {closed:false}).closed;
		var slideIndex = {
			"/":3,
			"/home":0,
			"/login":1,
			"/auth":2
		}[(that.props.routing.locationBeforeTransitions || that.props.location || {}).pathname] || 0



		return <div>
			<Route path="/auth" component={Auth} />
			<HeaderView slideIndex={slideIndex}/>
		</div>

		return <div>
				
				</div>;
	}
}

const mapStateToProps = (state, ownProps) => {
    return {...state, router: ownProps};
};

export default withRouter(connect(mapStateToProps)(Home))
