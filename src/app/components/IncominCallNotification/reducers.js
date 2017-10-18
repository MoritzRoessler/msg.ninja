export default function IncominCallNotificationReducer (state = {} , action) {
	let newState = {...state};

    switch (action.type) {
        case 'HANGUP_CALL':
        	
        	return newState;
        default:
            return newState;
    }
}