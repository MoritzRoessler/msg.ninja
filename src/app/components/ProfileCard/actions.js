const ACTIONS = {
	ACTION: 'ACTION'
}
export function FetchProfile (id, key) {
    // We return a function instead of an action object


    return (dispatch) => {
        dispatch ({
            type:' FETCH_PROFILE'
        })
        var url = "http://localhost:1234/profiles/google/" + id + "?key=" + key
        
        fetch (url).then (function (res) {
            
            res.json ().then (function (json) {
                
                return dispatch (FetchedProfile (json))
            })
        })
    };
}


function FetchedProfile (profile) {
    // We return a function instead of an action object

    return {
        type: 'FETCHED_PROFILE',
        data: profile
    }
}
