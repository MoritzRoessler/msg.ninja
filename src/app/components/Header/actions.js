const ACTIONS = {
	ACTION: 'ACTION'
}
export function HeaderAction(width, height) {
    // We return a function instead of an action object
    return {type:ACTIONS.ACTION, data: {
    }}

    return (dispatch) => {
        setTimeout(() => {
            // This function is able to dispatch other action creators
            //dispatch();
        }, 5000);
    };
}
