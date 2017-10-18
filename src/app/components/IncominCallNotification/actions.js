const ACTIONS = {
	ANSWER_CALL: 'ANSWER_CALL'
}
export function IncominCallNotificationAction(width, height) {
    // We return a function instead of an action object
    return {type:ACTIONS.ANSWER_CALL, data: {
    }}

    return (dispatch) => {
        setTimeout(() => {
            // This function is able to dispatch other action creators
            //dispatch();
        }, 5000);
    };
}

export function answerCall () {
    // We return a function instead of an action object
    return {type:ACTIONS.ANSWER_CALL, data: {
    }}

}
