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


class Main extends Component {
  render() { 
    return (
        <MuiThemeProvider muiTheme={muiTheme}>
          <div style={styles.container}>
            <ListCards />
          </div>
        </MuiThemeProvider>
    );
  }
}

export default Main;
