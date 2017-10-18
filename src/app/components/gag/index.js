import React, {Component} from 'react';
import { connect } from 'react-redux';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import {List, ListItem} from 'material-ui/List';

import SwipableView from 'react-swipeable-views'

class Gag extends Component {
	render () {
		return <Card>
			<SwipableView>
				{
					this.props.data.map (function (gag) {
						return <img src={gag.image} href={gag.url} />
					})
				}
			</SwipableView>
		</Card>
	}
}

const mapStateToProps = (state) => {
    return state.gag
};

export default connect(mapStateToProps)
(Gag)