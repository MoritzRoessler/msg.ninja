import React, {Component} from 'react';
import { connect } from 'react-redux';

import ResponsiveGrid, {size} from '../../container/ResponsiveGrid'
import {GridList, GridTile} from 'material-ui/GridList';

import AttributeList from '../AttributeList';
import AttributeValuesList from '../AttributeValuesList';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

class ListCards extends Component {

	render () {
		var containerCard = (<Card/>),
			cols = size(this.props);
			
		return <ResponsiveGrid>
			<GridTile cols={cols<=12?8:12}  containerElement={containerCard}>
			    <CardTitle> Attributes </CardTitle>
			    <CardMedia>
					<AttributeList />
				</CardMedia>
			</GridTile>
			<GridTile cols={cols<=8?8:cols<=12?4:3} containerElement={containerCard}>
				<CardTitle> Values </CardTitle>
				<CardMedia>
					<AttributeValuesList />
				</CardMedia>
			</GridTile>
		</ResponsiveGrid>
	}
}

const mapStateToProps = (state) => {
    return state.size
};

export default connect(mapStateToProps)
(ListCards)