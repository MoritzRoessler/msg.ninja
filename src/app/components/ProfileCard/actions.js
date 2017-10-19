import CONFIG from '../../../config.js';

const URL_BASE = [CONFIG.HOST_PROTOCOL, CONFIG.HOST,':', CONFIG.PORT_SERVER_DATA].join ("");
const API_PATH_PROFILE = "/profiles/google/"


const ACTIONS = {
	ACTION: 'ACTION'
}
export function FetchProfile (id, key) {
    // We return a function instead of an action object
    var query = id + "?key=" + key

    return (dispatch) => {

        dispatch ({
            type:' FETCH_PROFILE'
        })
        var url = URL_BASE + API_PATH_PROFILE + query
        
        fetch (url).then (function (res) {
            
            res.json ().then (function (json) {
                
                return dispatch (FetchedProfile (json))
            })
        })
    };
}


function FetchedProfile (profile) {
    // We return a function instead of an action object

    return {
        type: 'FETCHED_PROFILE',
        data: profile
    }
}
