//	React imports
import React from 'react';
import {render} from 'react-dom';

//	Redux imports
import configureStore from './state/configureStore';
import { Provider } from 'react-redux';

//	Material UI imports
import injectTapEventPlugin from 'react-tap-event-plugin';
import Main from './Main'; // Our custom react component


import {
  Router as Router,
  Route,
  IndexRoute,
  Link
} from 'react-router-dom'

import createHashHistory from 'history/createHashHistory';
import { syncHistoryWithStore } from 'react-router-redux';


const store = configureStore()

const history = syncHistoryWithStore(createHashHistory (), store);

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

// Render the main app react component into the app div.
// For more details see: https://facebook.github.io/react/docs/top-level-api.html#react.render
render(
	<Provider store={store}>
		<Router history={history}>
      		<Main />
      	</Router>
    </Provider>, document.getElementById('app'));
