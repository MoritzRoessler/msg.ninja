 const ACTIONS = {
	FETCH_EMAILS: 'FETCH_EMAILS',
    FETCHED_EMAILS: 'FETCHED_EMAILS',
    FETCHED_USER_EMAILS: "FETCHED_USER_EMAILS"
}

export default ACTIONS;

export function fetchEmails (token) {
    // We return a function instead of an action object
    return (dispatch) => {
        dispatch({type:ACTIONS.FETCH_EMAILS, data: token});

        fetch ("http://localhost:1234/emails/?key=" + token).then ((res) => res.json ()).then ((json) => {
            dispatch (fetchedEmails (json));
        })
    }
}

export function fetchUserEmails (token, email) {
    // We return a function instead of an action object
    
    
    return (dispatch) => {
        dispatch({type:ACTIONS.FETCH_EMAILS, data: token});
        var q = email.map ((e) => "from:" + e + " OR " + "to:" + e).join (" OR ");
        
    
        return fetch ("http://localhost:1234/email/?q="+q+"&key=" + token).then ((res) => res.json ()).then ((json) => {
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
