export default function ContactCardReducer (state = {selectedContactID: -1, open: true, dummy: {
    names: [
        {
            displayName: "Max mustermann"
        }
    ],
    phoneNumbers: [
        {
            canonicalForm: "+49176123456"
        }
    ],
    emailAddresses: [{value:"max.musermann@test.de"}]

}} , action) {
	let newState = {...state};

    switch (action.type) {
        case 'CLOSE_CONTACT_CARD':
        	newState.open = false
        	return newState;
        case 'OPEN_CONTACT_CARD':
            newState.open = true
            return newState;
        case 'SELECT_CONTACT':
            
    
        	newState.selectedContactID = action.data;
        	return newState;
        default:
            return newState;
    }
}