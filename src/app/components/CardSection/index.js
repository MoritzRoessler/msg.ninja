import React, {Component} from 'react';
import { connect } from 'react-redux';

import Subheader from 'material-ui/Subheader';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';


class CardSection extends Component {
	constructor (props) {
		super (props);

		this.state = {
			open: true
		}
	}

	toggle () {
		this.setState ({
			open: !this.state.open
		})
	}
	render () {
		return <div>
    	<Subheader onTouchTap={this.toggle.bind (this)}>
    		<div style={{display:"flex", flexDirection:"row"}}>
    			<div style={{flex:1,height:"48px"}}>
    				{this.props.iconLeft}
    			</div>
				<div style={{flex:5,height:"48px"}}>
					{this.props.title}
    			</div>
    			<div style={{flex:1,height:"48px"}}>
    				{this.props.iconRight}
    			</div>
    		</div>
    	</Subheader>
    	<hr />
    		{this.state.open?this.props.children:null}
   		 </div>
	}
}

const mapStateToProps = (state) => {
    return state;
};

export default CardSection