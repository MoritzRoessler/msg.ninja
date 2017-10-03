import React, {Component} from 'react';

import List from '../../container/List'
import {styleMapAttributeValueList, propertyMap} from '../../constants'

class AttributeValuesList extends Component {
	render () {
		return	<List multi={true}
                       selectable = {true}
                       propertyMap={propertyMap} 
                       name="values" 
                       sortBy="rank" 
                       parent="attributes"
                       linkedProp="values"
                       selectLinked={true}
                       src="http://demo0113689.mockable.io/values" 
                       patchUrl="http://demo0113689.mockable.io/attribute_values"
                       styleMap={styleMapAttributeValueList}
                />
	}
}

export default 
(AttributeValuesList)