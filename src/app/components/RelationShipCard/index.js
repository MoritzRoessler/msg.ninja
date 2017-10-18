import React, {Component} from 'react';
import { connect } from 'react-redux';

import {GridList, GridTile} from 'material-ui/GridList';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import {size} from '../../container/ResponsiveGrid/'

import Call from 'material-ui/svg-icons/communication/call'
import CallEnd from 'material-ui/svg-icons/communication/call-end'



class RelationShipCard extends Component {
	render () {
		return <Card>
			<CardTitle title="Friends" subtitle="for long"/>
		</Card>
	}
}

const mapStateToProps = (state) => {
    return state.size
};

export default connect(mapStateToProps)
(RelationShipCard)