import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Signup from './Signup';

const App = () => (
  <MuiThemeProvider>
    <Signup />
  </MuiThemeProvider>
);

ReactDOM.render(
  <App />,
  document.getElementById('content')
);
