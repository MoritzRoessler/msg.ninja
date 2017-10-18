export default function SpeechRecCardReducer (state = {transcript:"", contacts:[], index: 0} , action) {
	let newState = {...state};

    switch (action.type) {
        case 'FOUND_CONTACTS':
        	newState.contacts = action.data;
        	newState.index = action.index;
        	return newState;
        case 'SET_TRANSCRIPT':
        	newState.transcript = action.data;
        default:
            return newState;
    }
}