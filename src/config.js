const HOST = "localhost";
const HOST_PROTOCOL = "http://";
const PORT_SERVER_AUTH = 1235;
const PORT_SERVER_DATA = 1234;
const PORT_SERVER_SOCK = 4200;
const PORT_SERVER_DEV = 3000;
const DOMAIN = 'test.msg.ninja';
const DATABASE = '';
const KEY_PEER = 'lwjd5qra8257b9';

const BASE = HOST_PROTOCOL + HOST 
const BASE_LOCAL = BASE
const BASE_REMOTE = HOST_PROTOCOL + DOMAIN


const AUTH_BASE_LOCAL = BASE_LOCAL + ':' + PORT_SERVER_AUTH;
const DATA_BASE_LOCAL = BASE_LOCAL + ':' + PORT_SERVER_DATA;
const SOCK_BASE_LOCAL = BASE_LOCAL + ':' + PORT_SERVER_SOCK;

const AUTH_BASE_REMOTE = BASE_REMOTE
const DATA_BASE_REMOTE = BASE_REMOTE + '/api'
const SOCK_BASE_REMOTE = BASE_REMOTE + '/ws'

const CONFIG = {
	REMOTE: {
		AUTH_BASE: AUTH_BASE_REMOTE,
		DATA_BASE: DATA_BASE_REMOTE,
		SOCK_BASE: SOCK_BASE_REMOTE,
		AUTH_URL: AUTH_BASE_REMOTE + '/auth/google/',
		AUTH_RETURN_URL: BASE_REMOTE,
	},
	LOCAL: {
		AUTH_BASE: AUTH_BASE_LOCAL,
		DATA_BASE: DATA_BASE_LOCAL,
		SOCK_BASE: SOCK_BASE_LOCAL,
		AUTH_URL:  AUTH_BASE_LOCAL + '/auth/google/',
		AUTH_RETURN_URL: BASE_LOCAL,
	}
}


export default CONFIG.REMOTE;
