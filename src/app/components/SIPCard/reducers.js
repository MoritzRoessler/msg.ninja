export default function SIPCardReducer (state = {active:false, caller: {callingID: null}, peerID: {}, call: {}} , action) {
	let newState = {...state};
    switch (action.type) {
        case 'SET_PEER_ID':
        	newState.peerID [action.userID] = action.data;
        	return newState;
        case 'SET_PEER':
        	newState.peer = action.data;
        	return newState;
	 	case 'SET_STREAM':
	 		newState.stream = action.stream;
	 		newState.caller = action.from;     	
			newState.call 	= action.call;		         	
	 		
	 		return newState;
	 	case 'ANSWER_CALL':
	 		newState.active = +new Date;
	 		return newState;
	 	case 'HANGUP_CALL':
	 		newState.stream = null;
	 		 newState.call = {};
	 		newState.active = false;
		   newState.caller = {callingID:null}

		   return newState;

        default:
            return newState;
    }
}