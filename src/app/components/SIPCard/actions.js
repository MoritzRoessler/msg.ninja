import Peer from 'peerjs'

const ACTIONS = {
	SET_PEER_ID: 'SET_PEER_ID',
    SET_PEER: 'SET_PEER'
}



    
export function SIPCardAction(width, height) {
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

export function updatePeerID (peerID) {
    if (io) {

    }
}
export function setPeerID (peerID, userID) {
    // We return a function instead of an action object
    return {
        type:ACTIONS.SET_PEER_ID, 
        data: peerID,
        userID: userID
    }

    return (dispatch) => {
        setTimeout(() => {
            // This function is able to dispatch other action creators
            //dispatch();
        }, 5000);
    };
}


export function setPeer (peer) {
    // We return a function instead of an action object
    return {
        type:ACTIONS.SET_PEER, 
        data: peer
    }

    return (dispatch) => {
        setTimeout(() => {
            // This function is able to dispatch other action creators
            //dispatch();
        }, 5000);
    };
}

export function callIncoming (stream, call) {

    return (dispatch) => {
        return dispatch ({
            type: 'SET_STREAM',
            stream: stream,
            call: call,
            from: call.metadata
        })
    };
}