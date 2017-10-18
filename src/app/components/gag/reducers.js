import ACTIONS from './actions';

export default function GagReducer (state = {} , action) {
	let newState = {...state};

    switch (action.type) {
        case 'FETCHED_GAGS':
        	newState.data = action.data;
        	return newState;
        default:
            return newState;
    }
}