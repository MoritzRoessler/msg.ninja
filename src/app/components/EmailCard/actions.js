 const ACTIONS = {
	FETCH_EMAILS: 'FETCH_EMAILS',
    FETCHED_EMAILS: 'FETCHED_EMAILS',
    FETCHED_USER_EMAILS: "FETCHED_USER_EMAILS"
}
export default ACTIONS;

import CONFIG from '../../../config.js';

const URL_BASE = [CONFIG.HOST_PROTOCOL, CONFIG.HOST,':', CONFIG.PORT_SERVER_DATA].join ("");
const API_PATH_EMAILS= "/emails/"
const API_PATH_EMAIL= "/email/"


export function fetchEmails (token) {
    var query = "?key=" + token
    // We return a function instead of an action object
    return (dispatch) => {
        dispatch({type:ACTIONS.FETCH_EMAILS, data: token});

        fetch (URL_BASE + API_PATH_EMAIL + query).then ((res) => res.json ()).then ((json) => {
            dispatch (fetchedEmails (json));
        })
    }
}

export function fetchUserEmails (token, email) {
    // We return a function instead of an action object
    var q = email.map ((e) => "from:" + e + " OR " + "to:" + e).join (" OR ");
    var query = "?q="+q+"&key=" + token
    
    return (dispatch) => {
        dispatch({type:ACTIONS.FETCH_EMAILS, data: token});
        
    
        return fetch (URL_BASE + API_PATH_EMAIL + query).then ((res) => res.json ()).then ((json) => {
            return dispatch (fetchedUserEmails (json, email));
        })
    }
}

function fetchedEmails (data) {
    // We return a function instead of an action object
    return ({type:ACTIONS.FETCHED_EMAILS, data: data});
}


function fetchedUserEmails (data, email) {
    // We return a function instead of an action object
    return ({type:ACTIONS.FETCHED_USER_EMAILS, data: data, email});
}
