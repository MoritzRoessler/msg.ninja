import CONFIG from '../../../config.js';


const URL_BASE = [CONFIG.HOST_PROTOCOL, CONFIG.HOST,':', CONFIG.PORT_SERVER_DATA].join ("");
const API_PATH_DIRECTIONS = "/directions/"


export function SelectContact (id) {
    // We return a function instead of an action object
    return (dispatch) => {
        dispatch ({
            type: 'SELECT_CONTACT',
            data: id
        })


    }
    return 
}

export function FetchDirections (from, to) {
    
    
    return (dispatch) => {
        var query = "from="+from+"&to="+to
        return fetch (URL_BASE + API_PATH_DIRECTIONS + query)
        .then ((res) => res.json ())
        .then (function (json) {
            
    
            dispatch (SetDirections (json));
        })
    }
}
export function SetDirections (directions) {
    return {
        type: 'SET_DIRECTIONS',
        data: directions
    }
}
function FetchedProfile (profile) {
    // We return a function instead of an action object

    return {
        type: 'FETCHED_PROFILE',
        data: profile
    }
}
