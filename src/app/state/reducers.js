import { combineReducers } from 'redux';
import List from '../container/List/reducers.js'
import size from '../container/ResponsiveGrid/reducers.js'
import authReducer from '../components/Auth/reducers.js'
import profileReducer from '../components/ProfileCard/reducers.js'
import contactsReducer from '../components/Contacts/reducers.js'
import contactReducer from '../components/ContactCard/reducers.js'
import peerReducer from '../components/SIPCard/reducers.js'
import emailReducer from '../components/EmailCard/reducers.js'
import speechReducer from '../components/SpeechRecCard/reducers.js'
import {routerReducer} from 'react-router-redux';


function localStorageReducer (state, action) {
	switch (action) {}
}
export default combineReducers({
	List,
	size,
	routing:routerReducer,
	auth:authReducer,
	profile: profileReducer,
	contacts: contactsReducer,
	contact: contactReducer,
	peer: peerReducer,
	email: emailReducer,
	speech:speechReducer
});