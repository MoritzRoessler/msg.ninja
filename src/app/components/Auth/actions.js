import CONFIG from '../../../config.js';

const URL_BASE = CONFIG.DATA_BASE
const API_PATH_TOKENS = "/tokens/"


export const ACTIONS = {
    AUTHENTICATE: 'AUTHENTICATE',
    TOKEN_GOOGLE: 'TOKEN_GOOGLE'
}


export function authenticate (token) {
    var query = '?jwt=' + token
    // We return a function instead of an action object
    return (dispatch) => {
        dispatch({type:ACTIONS.AUTHENTICATE, data: token});

        fetch (URL_BASE + API_PATH_TOKENS + query).then ((res) => res.json ()).then (function (json) {
            var tok = json [0];
            dispatch (setGoogleToken (tok.googleAccessToken));
        })

    }
}


export function setGoogleToken (token) {
    // We return a function instead of an action object
    return ({type:ACTIONS.TOKEN_GOOGLE, data: token});
}
