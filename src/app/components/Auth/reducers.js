import { ACTIONS } from './actions';
import jwt from 'jwt-simple'


export default function AuthReducer (state = {jwt: null} , action) {
	let newState = {...state};

    switch (action.type) {
        case ACTIONS.AUTHENTICATE:
        	var token = action.data

        	var decoded = jwt.decode (token, "SECRET_HIDDEN");

        	newState.jwt = token;
        	newState.displayName = decoded.displayName;
        	newState.email = decoded.email;
        	newState.expires = decoded.expiresAt;
        	newState.userID = decoded.userID;
        	return newState;
        case ACTIONS.TOKEN_GOOGLE:
        	newState.googleToken = action.data;
        default:
            return newState;
    }
}