const ACTIONS = {
	RESIZE: 'WINDOW_RESIZE'
}
export function setSize(width, height) {
    // We return a function instead of an action object
    return {type:ACTIONS.RESIZE, size: {
    	w: width,
    	h: height
    }}

    return (dispatch) => {
        setTimeout(() => {
            // This function is able to dispatch other action creators
            dispatch(itemsHasErrored(true));
        }, 5000);
    };
}


