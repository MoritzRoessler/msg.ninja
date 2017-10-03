import { combineReducers } from 'redux';
import List from '../container/List/reducers.js'
import size from '../container/ResponsiveGrid/reducers.js'


export default combineReducers({
	List,
	size
});