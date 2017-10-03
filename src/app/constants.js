export const StyleMapRank = {
	rank: {
	  $eq: [{
	            value: 1,
	            style: {color: "green"}
	      },{
	            value: 2,
	            style: {color: "yellow"}
	      },{
	            value: 3,
	            style: {color: "red"}
	      }
	    ]
	  },
	linked: {
		$eq: [{
			value: true,
			style: {backgroundColor: '#E0E0E0'}
		}]
	}
}
export const StyleMapSelected = {
	selected: {
      $eq: [{
          value: true,
          style: {backgroundColor: "#D0D0D0"}
      }]
    }
}

export const styleMapAttributeList = {...StyleMapSelected}

export const styleMapAttributeValueList = {...StyleMapSelected, ...StyleMapRank}


export const propertyMap = {
	primaryText: "name"
}

export const styles = {
	defaultStyle: {}
}
