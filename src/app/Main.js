/**
 * In this file, we create a React component
 * which incorporates components provided by Material-UI.
 */
import React, {Component} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import {deepOrange500} from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import ResponsiveGrid from './container/ResponsiveGrid'
import ListCards from './components/ListCards';
import Home from './components/Home';


import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

require('es6-promise').polyfill();
require('fetch-everywhere');
 

const styles = {
  container: {
    textAlign: 'center',
  },
};

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500,
  },
});


/** The Main Component*/
class Main extends Component {
/**
     * Render the Main Component
     * @return {React.Element}
     */
    render() {
      return (
          <MuiThemeProvider muiTheme={muiTheme}>
            <div style={styles.container}>
              <Home />
            </div>
          </MuiThemeProvider>
    );
  }
}

export default DragDropContext(HTML5Backend)(Main);
