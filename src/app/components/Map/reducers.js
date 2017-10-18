export default function MapReducer (state = {} , action) {
	let newState = {...state};

    switch (action.type) {
        case '':
        	return newState;
        default:
            return newState;
    }
}