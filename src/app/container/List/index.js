import React, {Component} from 'react';
import { connect } from 'react-redux';

import {List, ListItem} from 'material-ui/List';
import {Fetch, FetchItems, SelectItem, PatchItem} from './actions'


const Reducer = {
	StyleReducer : (style, rule) => {
		for (let key in rule.style) {
			style [key] = rule.style [key];
		}
		return style;
	}
}

const RuleEvaluator = (prop, item, operators) => {
	var result = {};

	for (let op in operators)
	for (let reducer in Reducer)
	switch (op) {
		case "$eq": 
			return operators[op].filter ((rule) => {
				return item [prop] == rule.value;
			}).reduce (Reducer[reducer],  result);
		default:
			return result;
		
	}
}


class  LinkedDataList extends Component {
	componentDidMount () {
		this.props.dispatch (Fetch (this.props.src, this.props.name));

	}


	onSelect (item) {
		var props=this.props, rel = props.linkedProp, selectedRelatives = this.getSelectedRelatives (),  items;

		if (!props.selectable) return;

		if (item.selected) return //this.onDeselect (item);

		if (props.linkedProp) {
			if (props.child) {
				items = item [rel] 
				props.dispatch (SelectItem (props.child, items.map ((item) => item.id), !!props.multi));
				props.dispatch (SelectItem (props.name, [item.id], !!props.multi));
			} else if (props.parent && selectedRelatives.length){
				props.dispatch (PatchItem (props.patchUrl, props.name,  selectedRelatives, props.parent, rel, item));
			}

		} else {
			props.dispatch (SelectItem (props.name, [item], !!props.multi));
		}

		if (props.onSelect) {
			props.onSelect (item);
		}
	}

	getSelectedItemIDs (listName) {
		var props = this.props;
		return props.selected [listName || props.name] || [];
	}

	getSelectedRelatives () {
		return this.getSelectedItemIDs (this.props.parent || this.props.child)
	}

	getLinkedParentsChildren () {
		var selectedParent = this.getSelectedRelatives() [0];
		return this.props.data[this.props.parent].filter ((item) => item.id === selectedParent)[0].values
	}

	ItemFactory (item)  {
		var style, 
			itemProps = this.propertyMapper (item),
			selected = this.getSelectedItemIDs (),
			selectedParent = this.getSelectedRelatives() [0],
			linkedToParent =  false,
			secondaryText = "";


		item.selected = !!~selected.indexOf (item.id);

		if (this.props.parent && this.props.linkedProp && selectedParent) {	
			linkedToParent = !!this.getLinkedParentsChildren ().filter ((child) => {
				return child.id == item.id
			}).length;
		
			item.linked = linkedToParent

			if (this.props.selectLinked) {
				item.selected = item.linked
			}
		}

		style = this.styleMapper (item) || styles.defaultStyle;

		if (this.props.secondaryTextFormatter) {
			secondaryText = this.props.secondaryTextFormatter (item);
			itemProps.secondaryText = secondaryText;
		}

		return <ListItem key={this.props.name + "-" + item.id} onTouchTap={this.onSelect.bind (this, item)} {...itemProps} style={style}/>
	}


	propertyMapper (item) {
		var props = {},
			map = this.props.propertyMap || {};
		
		for (let key in map)
			props [key] = item [map [key]];

		return props;			
	}


	styleMapper (item) {
		var style = {},
			propMap = this.props.styleMap;

		for (let key in propMap) {
				style = {...style, ...RuleEvaluator (key, item, propMap [key])}	
		}

		return style;	
	}


	getItemData (src) {
		return this.props.data[src] || this.props.defaultData;	
	}


	sortItemData (items) {
		var sortBy = this.props.sortBy;

		if (!sortBy) return items;

		return items.sort ((a,b) => {
			var l = a[sortBy], r=b[sortBy];
			return l < r ? -1 : l > r ? 1 : 0
		})	

	}

	getListItems (src) {
		return this.sortItemData (this.getItemData (src)).map (this.ItemFactory.bind (this));
	}

	render () {
		return <List key={this.props.name}>
			{this.getListItems (this.props.name)}
		</List>
	}
}

const mapStateToProps = (state) => {
    return state.List
};

export default connect(mapStateToProps)
(LinkedDataList)