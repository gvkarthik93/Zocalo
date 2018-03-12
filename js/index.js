import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Mainpage from './Mainpage';
//import Login from './Login';

const App = () => (
  <MuiThemeProvider>
    <Mainpage />
  </MuiThemeProvider>
);

ReactDOM.render(
  <App />,
  document.getElementById('content')
);
