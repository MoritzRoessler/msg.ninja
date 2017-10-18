import ACTIONS from './actions'
export default function EmailCardReducer (state = {emails: [], user: {}} , action) {
	let newState = {...state};

    switch (action.type) {
    	case 'FETCH_EMAILS':
    		newState.fetching = true;
    		return newState;
        case ACTIONS.FETCHED_EMAILS:
        	newState.emails = action.data;
        	newState.fetching = false;
        	return newState;
        case "FETCHED_USER_EMAILS":
        	
    
        	newState.user[action.email] = action.data;
        	newState.fetching = false;

        	return newState;
        default:
            return newState;
    }
}