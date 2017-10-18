const ACTIONS = {
	ACTION: 'ACTION'
}
export function SelectContact (id) {
    // We return a function instead of an action object
    return (dispatch) => {
        dispatch ({
            type: 'SELECT_CONTACT',
            data: id
        })


    }
    return 
}

export function FetchDirections (from, to) {
    
    
    return (dispatch) => {
        return fetch ("http://localhost:1234/directions/?from="+from+"&to="+to)
        .then ((res) => res.json ())
        .then (function (json) {
            
    
            dispatch (SetDirections (json));
        })
    }
}
export function SetDirections (directions) {
    return {
        type: 'SET_DIRECTIONS',
        data: directions
    }
}
function FetchedProfile (profile) {
    // We return a function instead of an action object

    return {
        type: 'FETCHED_PROFILE',
        data: profile
    }
}
