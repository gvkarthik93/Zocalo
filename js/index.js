import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Mainpage from './Mainpage';

const App = () => (
  <MuiThemeProvider>
    <Mainpage />
  </MuiThemeProvider>
);

ReactDOM.render(
  <App />,
  document.getElementById('content')
);
