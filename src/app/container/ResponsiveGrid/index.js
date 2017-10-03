import { connect } from 'react-redux';
import {GridList, GridTile} from 'material-ui/GridList';
import React, {Component} from 'react';
import {setSize} from "./actions"


export const size = (state) => {
    var s = state.w

    if (s > 960) return 15
    if (s >= 768) return 12
    if (s >= 400) return 8

    return 3
}

const consts = {
	PADDING: 8
}

class ResponsiveGrid extends Component {

	componentDidMount () {
		  window.addEventListener ("resize", this.resize.bind(this))
	}

	resize (e) {
		  this.props.dispatch (setSize (window.innerWidth, window.innerHeight))
	}

	render () {
    var cols = size (this.props);

		return  <GridList
                cols={cols}
                cellHeight={"auto"}
                padding={consts.PADDING}
                style={this.props.style}
            >
            		{this.props.children}
            </GridList>
	  }
}

const mapStateToProps = (state) => {
    return state.size
};


const mapDispatchToProps = (dispatch) => {
    return {
        setSize: (e) => dispatch(e)
    };
};

export default connect(mapStateToProps)
(ResponsiveGrid)
