import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import RaisedButton from 'material-ui/RaisedButton';
import {Grid, Row, Col} from 'react-flexbox-grid/lib/index';
import {BrowserRouter as Router, Link} from 'react-router-dom';
import 'whatwg-fetch';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
        username: '',
        password: '',
        open: false
    };
    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.sendPostRequest = this.sendPostRequest.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  sendPostRequest() {
    console.log("Submitted username: " + this.state.username);
    console.log("Submitted password: " + this.state.password);
    fetch('access/login', {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'login',
        username: this.state.username,
        password: this.state.password
      })
    }).then(function(res) {
      return res.json();
    }).then(function(data) {
      console.log(data);
      if (data.status == 0) {
        console.log("no username found.");
        this.setState({open: true});
      }
      else if (data.status == 1) {
        localStorage.setItem('jwtToken', data.token);
        localStorage.setItem('username', this.state.username);
        console.log(data.token);
        this.props.history.push('/MainPage');
      }
    }.bind(this))
  }
  handleChangeUsername(e) {
      this.setState({username: e.target.value});
  }
  handleChangePassword(e) {
      this.setState({password: e.target.value});
  }
  handleClose(e) {
    this.setState({open: false});
  }
  handleSubmit(e) {
      e.preventDefault();
      this.sendPostRequest();
      console.log("Submitted");
  }
  render() {
    //console.log(this.props);
    const actions = [
      <FlatButton
        label="OK"
        primary={true}
        onClick={this.handleClose}
      />
    ];
    return (
      <Row>
          <Col md={2} lg={2}/>
          <Col md={8} lg={8}>
            <Paper style={styles.container}>
              <h1 style={styles.title}>Login</h1>
              <form onSubmit={this.handleSubmit}>
                <TextField
                  floatingLabelText="Username"
                  value={this.state.username}
                  onChange={this.handleChangeUsername}
                /><br/>
                <TextField
                  floatingLabelText="Password"
                  type="password"
                  value={this.state.password}
                  onChange={this.handleChangePassword}
                /><br/>
                <div style={{marginTop: 20, marginBottom: 15, textAlign: 'center', fontSize: 13, color: '#ccc'}}>
                  <Link to="/SignupPage">Do not have an account? Signup!</Link>
                </div>
                <RaisedButton label="login" primary={true} style={styles.submitButton}
                  type="submit"
                  onClick={this.handleSubmit}
                  disabled={this.state.username == ""
                  || this.state.password == "" ? true : false}/>
              </form>
            </Paper>
            <Dialog
              title="Login unsuccessful"
              actions={actions}
              modal={false}
              open={this.state.open}
              onRequestClose={this.handleClose}
            >
              <p>This username password combination is invalid. Please try again!</p>
            </Dialog>
          </Col>
          <Col md={2} lg={2}/>
      </Row>
    )
  }
}
const styles = {
  container: {
    position: 'relative',
    width: '100%',
    margin: '35px 0px',
    padding: '35px 15px',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  radioButton: {
    marginBottom: 16,
    width: '256px'
  },
  submitButton: {
    marginTop: '20px',
    width: '100%'
  },
  title: {
      fontFamily: 'Nunito, sans-serif',
      fontWeight: '700',
      fontSize: '32px',
      marginTop: '10px'
  }
}
