import {ACTIONS} from './actions'

export default function ListReducer (state = {
	data: {},
    selected: {},
	defaultData: [{name: "Loading..."}]
}, action) {
	let newState = {...state};
	newState.data = {...newState.data}
    newState.selected = {...newState.selected}
    
    switch (action.type) {
        case ACTIONS.FETCH_ITEMS:
        	newState.loading = true
        	return newState;
       
        case ACTIONS.ITEMS_FETCHED:
        	newState.loading = false
        	newState.data [action.key] = action.data;
        	return newState;

        case ACTIONS.SELECT_ITEM:
            newState.selected [action.key] = newState.selected [action.key] || [];

            if (action.multi) {
                newState.selected [action.key] = newState.selected [action.key].concat (action.ids).filter ((id,i,arr) => !~arr.indexOf (id,i+1));
            } else {
                newState.selected [action.key] = action.ids
            }

            return newState;

        case ACTIONS.ADD_ITEM:
            let list = newState.data [action.parent], item = action.item, addTo;

            addTo = action.addTo.map ((id) => {
                return list.filter ((item) => item.id === id)[0]
            })

            for (let i=0; i<addTo.length; i++) {
                let target=addTo [i], values;

                if (target ){
                    target[action.rel] = [...target[action.rel].filter ((obj) => obj.id !== item.id), {id: item.id, name: item.name}];
                }
            }
            
            return newState;

        case ACTIONS.UPDATE_ITEM:
            var itemToUpdate = newState.data [action.key].filter ((item) => item.id == action.id)[0];
            
            itemToUpdate.values = action.values;

            return newState;

        default:
            return newState;
    }
}