
try {
	var w = window
} catch (e) {
	w = {
		innerHeight: 960,
		innerWidth: 1080
	}
} 

export default function size (state = {w: w.innerWidth, h: w.innerHeight} , action) {
    switch (action.type) {
        case 'WINDOW_RESIZE':
            return action.size
        default:
            return state;
    }
}