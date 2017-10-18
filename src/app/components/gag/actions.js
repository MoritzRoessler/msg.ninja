const ACTIONS = {
	ACTION: 'ACTION',
    FETCHED_GAGS: "FETCHED_GAGS"
}

import Gag from 'node-9gag';

export function GagAction(width, height) {
    // We return a function instead of an action object
    return (dispatch) => {
        return gag.section('section', function (err, res) {
                dispatch (FetchedGags (res));
              // res = [
              //   {
              //     title: null,
              //     id: null,
              //     url: null,
              //     image: null,
              //     points: null,
              //     commentCount: null
              //   }
              // ]
            });
    }

}

function FetchedGags (gags) {
    return {
        type: ACTIONS.FETCHED_GAGS,
        data: gags
    }
}