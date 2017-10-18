import React, {Component} from 'react';
import { connect } from 'react-redux';


class GoogleDriveMap extends Component {
	render () {
		return 'GoogleDriveMap'
	}
}

const mapStateToProps = (state) => {
    return state.size
};

export default connect(mapStateToProps)
(GoogleDriveMap)