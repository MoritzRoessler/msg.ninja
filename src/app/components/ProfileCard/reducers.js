export default function ProfileCardReducer (state = {loading: false, loaded: false, profile: {emails: [], image: {url:""}}} , action) {
	let newState = {...state};

    switch (action.type) {
        case 'FETCH_PROFILE':
        	newState.loading = true;
        	newState.loaded = false;
        	return newState;
        case 'FETCHED_PROFILE':
        	newState.loading = false;
        	newState.loaded = true;
        	newState.profile = action.data.profileData;
        	return newState;
        case 'TOKEN_GOOGLE':
        	newState.google = true
        default:

            return newState;
    }
}