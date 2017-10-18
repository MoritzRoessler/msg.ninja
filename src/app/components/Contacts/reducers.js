import { ACTIONS } from './actions';
import jwt from 'jwt-simple'


export default function AuthReducer (state = {loaded: false, loading: false, contacts: [], users: [], skills: [{title:"Biken", id:1, category:"Sports"}] } , action) {
	let newState = {...state};

    switch (action.type) {
        case ACTIONS.FETCH_CONTACTS:
        	newState.loading = true;
        	return newState;
        case ACTIONS.FETCHED_CONTACTS:
            newState.loading = false;
            newState.loaded = true;
        	newState.contacts = action.data;
            return newState;
        case ACTIONS.CREATE_USER:
            newState.loading = true;
            //optimistically add user on client
            return newState;
        case ACTIONS.CREATED_USER:
            //insert user
            return newState;
        case ACTIONS.FETCHED_USER:
            newState.users = action.data;
            
            return newState; 
        case 'SET_DIRECTIONS':
            window.directions = action.data
            newState.directions = action.data;
            return newState;       
        case 'SELECT_CONTACT':


            newState.selectedContactID = action.data;

            var contact = newState.contacts.filter (function (c) {
                return c.id == action.data
            })[0]

            newState.selectedContact = contact;
            if (!contact) return newState;

           newState.selectedUser = (newState.users.filter (function (user) {
                return (contact.emailAddresses||[]).reduce ((has, email) => {
                    return has ||   email.value == user.email
                }, false)
            })[0]||{id:null})


           newState.selectedUserID = newState.selectedUser.id

            return newState;
        case ACTIONS.FETCHED_SKILLS:
            newState.skills = action.data.skills;
            newState.impressions = action.data.impressions;
            return newState;
        case ACTIONS.ADDED_IMPRESSION:
            newState.impressions.push (action.data);
            return newState
        default:        
            return newState;
    }
}