export const ACTIONS = {
	AUTHENTICATE: 'AUTHENTICATE',
    TOKEN_GOOGLE: 'TOKEN_GOOGLE'
}

export function authenticate (token) {
    // We return a function instead of an action object
    return (dispatch) => {
        dispatch({type:ACTIONS.AUTHENTICATE, data: token});

        fetch ('http://localhost:1234/tokens/?jwt=' + token).then ((res) => res.json ()).then (function (json) {
            var tok = json [0];
            dispatch (setGoogleToken (tok.googleAccessToken));
        })

    }
}


export function setGoogleToken (token) {
    // We return a function instead of an action object
    return ({type:ACTIONS.TOKEN_GOOGLE, data: token});
}
