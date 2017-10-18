export const ACTIONS = {
	FETCH_CONTACTS: 'FETCH_CONTACTS',
    FETCHED_CONTACTS: 'FETCHED_CONTACTS',
    CREATE_USER: 'CREATE_USER',
    CREATED_USER: 'CREATED_USER',
    FETCHED_USER: 'FETCHED_USER',
    FETCH_SKILLS: 'FETCH_SKILLS',
    FETCHED_SKILLS: 'FETCHED_SKILLS',
    ADDED_IMPRESSION: 'ADDED_IMPRESSION'
}

const HEADERS = {
  JSON: {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json'
  }
}

var GoogleContacts = require('google-contacts-api')

export function fetchContacts (token) {
    // We return a function instead of an action object
    return (dispatch) => {
        dispatch({type:ACTIONS.FETCH_CONTACTS, data: token});

        fetch ("http://localhost:1234/contacts/?key=" + token).then ((res) => res.json ()).then ((json) => {
            dispatch (fetcedContacts (json));
        })

  

    }
}

export function fetchUser (token, email) {
    // We return a function instead of an action object
    return (dispatch) => {
        dispatch({type:ACTIONS.FETCH_CONTACTS, data: token});

        fetch ("http://localhost:1234/users/?key=" + token).then ((res) => res.json ()).then ((json) => {
            dispatch (fetcedUser (json));
        })
    }
}

export function fetchSkills (token) {
    return (dispatch) => {
        dispatch({type:ACTIONS.FETCH_SKILLS, data: token});

        fetch ("http://localhost:1234/skills/?key=" + token).then ((res) => res.json ()).then ((skills) => {
            fetch ("http://localhost:1234/user/skills/?key=" + token).then((res) => res.json()).then ((impressions) => {
                
                dispatch (fetchedSkills ({skills, impressions}));
            })
        })
    }

}

export function fetchedSkills (data) {
    return {
        type: ACTIONS.FETCHED_SKILLS,
        data: data
    }

}

export function createUserFromContact (contact, token) {
    // We return a function instead of an action object
    return (dispatch) => {
        dispatch({type:ACTIONS.CREATE_USER, data: token});

        var userData = {
            username: contact.names [0].displayName,
            email: contact.emailAddresses [0].value
        }
        
    
        fetch ("http://localhost:1234/users/?key=" + token, {
            method: 'POST',
            headers: HEADERS.JSON,
            body: JSON.stringify (userData)
        }).then ((res) => res.json ()).then ((json) => {
            dispatch (createdUserFromContact (json));
            dispatch (fetchUser (token, userData.email));
        })

    }
}

export function addImpression (from, to, skill, stars, token) {
    // We return a function instead of an action object
    return (dispatch) => {
       // dispatch({type:ACTIONS.CREATE_USER, data: token});

        var userData = {
            from: from,
            to: to,
            skill: skill,
            rating: stars
        }
        
    
        fetch ("http://localhost:1234/user/skills/?key=" + token, {
            method: 'POST',
            headers: HEADERS.JSON,
            body: JSON.stringify (userData)
        }).then ((res) => res.json ()).then ((json) => {
            
    
            dispatch (addedImpression (json))
           // dispatch (createdUserFromContact (json));
            //dispatch (fetchUser (token, userData.email));
        })

    }
}

function addedImpression (json) {
    return {
        type: ACTIONS.ADDED_IMPRESSION,
        data: json
    }
}

 function createdUserFromContact (user) {
    // We return a function instead of an action object
    return {
        type: ACTIONS.CREATED_USER,
        data: user
    }
}


function fetcedContacts (data) {
    // We return a function instead of an action object
    return ({type:ACTIONS.FETCHED_CONTACTS, data: data});
}

function fetcedUser (data) {
    // We return a function instead of an action object
    return ({type:ACTIONS.FETCHED_USER, data: data});
}
