export const ACTIONS = {
	ITEMS_FETCHED: "ITEMS_FETCHED",
    SELECT_ITEM: "SELECT_ITEM",
    FETCH_ITEMS: "FETCH_ITEMS",
    ADD_ITEM: "ADD_ITEM",
    UPDATE_ITEM: "UPDATE_ITEM"
};

const headers = { 'Content-Type':'application/x-www-form-urlencoded' };

const encodeBody = (obj) => {
    return Object.keys (obj).reduce ((str, prop) => {
        return str + "&" + prop + "=" +  obj[prop] 
    }, "").slice (1)
}

export function Fetch (url, key) {
    return (dispatch) => {
        dispatch (FetchItems ())
        fetch (url).then (function (res) {
            res.json().then (function (data) {
                dispatch (ItemsFetched(key,data))
            })
        });
    };
}


export function PatchItem (url,key, addTo, parent, rel, item) {
    return (dispatch) => {
        var patchUrl = url + "?" + encodeBody ({attribute_id: addTo [0], value_id: item.id})
        dispatch (AddItem (addTo, parent, rel, item))
        dispatch (SelectItem (key, [item.id], true))
        fetch (patchUrl, {headers, method: 'PATCH'}).then (function (res) {
            res.json ().then (function (data) {
                 dispatch (UpdateItem (parent, data.id, data.values))   
            })
        })
    }

}

export function UpdateItem (key , id , values) {
    return {
        type: ACTIONS.UPDATE_ITEM,
        key,
        id,
        values
    }
}
export function AddItem (addTo, parent, rel, item) {
    return {
        type: ACTIONS.ADD_ITEM,
        addTo, 
        parent,
        rel,
        item
    }
}

export function SelectChildren (key, ids, multi) {
    return {
        type: ACTIONS.SELECT_ITEM,
        key,
        ids,
        multi
    }
}

export function SelectItem (key, ids, multi) {
    return {
        type: ACTIONS.SELECT_ITEM,
        key,
        ids,
        multi
    }
}

export function FetchItems () {
    return {
        type: ACTIONS.FETCH_ITEMS
    }
}

export function ItemsFetched (key,data) {
    return {    
        type: ACTIONS.ITEMS_FETCHED, 
        key,
        data
    }
}