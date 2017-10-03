import React, {Component} from 'react';

import List from '../../container/List'
import {styleMapAttributeList, propertyMap} from '../../constants'


class AttributeList extends Component {
	secondaryTextFormatter (item) {
		return (item.values || [] ).map ((item) => item.name).join (", ")
	}
	render () {
		return <List   propertyMap={propertyMap} 
                       selectable = {true}
                       name="attributes"
                       child="values"
                       secondaryTextFormatter={this.secondaryTextFormatter}
                       linkedProp="values" 
                       onSelect={this.onSelect}
                       src="http://demo0113689.mockable.io/attribute_values" 
                       styleMap={styleMapAttributeList}
                 />
	}
}

const mapStateToProps = (state) => {
    return {List: state.List, AttributeList: state.AttributeList}
};

export default (AttributeList)