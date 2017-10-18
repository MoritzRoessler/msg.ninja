import React, {Component} from 'react';
import { connect } from 'react-redux';
import {authenticate } from './actions'


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
		const parsed = querystring.parse(this.props.location.search);
		
    
		this.props.dispatch (authenticate (parsed.jwt))


	}
	render () {
		var pathName = (this.props.routing.locationBeforeTransitions || this.props.location).pathname;
		if (this.props.auth.jwt &&  pathName != "/")
			return <Redirect to="/" />
		else
			return null;
	} 
}

const mapStateToProps = (state) => {
    return state
};

export default connect(mapStateToProps)
(Auth)