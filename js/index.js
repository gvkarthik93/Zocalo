import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Mainpage from './Mainpage';
import Login from './Login';
import Signup from './Signup';
import PostDetailPage from './PostDetailPage';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: ''
    };
    this.setCurrentUser = this.setCurrentUser.bind(this);
  }
  setCurrentUser(token) {
    this.setState({currentUser: token});
  }
  render() {
    return (
      <MuiThemeProvider>
        <Router>
          <Switch>
            <Route path="/SignupPage" component={Signup} />
            <Route path="/MainPage" render={(props) => <Mainpage {...props} currentUser={this.state.currentUser}/>} />
            <Route path="/LoginPage" render={(props) => <Login {...props} setCurrentUser={this.setCurrentUser}/>} />
            <Route path="/PostDetailPage/posts/:pid" component={PostDetailPage} />
            <Route path="/" render={(props) => <Login {...props} setCurrentUser={this.setCurrentUser}/>} />
          </Switch>
        </Router>
      </MuiThemeProvider>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('content')
);
