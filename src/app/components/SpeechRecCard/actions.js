const ACTIONS = {
	ACTION: 'ACTION'
}
export function SpeechRecCardAction(width, height) {
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




export function foundContacts (contacts, index) {
    
    if (contacts.length)
    return (dispatch) => {
        dispatch ({
            type: "SELECT_CONTACT",
            data: contacts [index % contacts.length].id
        })
        dispatch ({
            type: "FOUND_CONTACTS",
            data: contacts,
            index: index % contacts.length
        })
        setTranscript ("")
    }
}


export function setTranscript (last, current, all) {
    return (dispatch) => {
        dispatch ({
            type: "SET_TRANSCRIPT",
            data: {
                last,
                current,
                all
            }
        })
    }
}
