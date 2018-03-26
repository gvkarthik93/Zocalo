import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import RaisedButton from 'material-ui/RaisedButton';
import {Grid, Row, Col} from 'react-flexbox-grid/lib/index';
import 'whatwg-fetch';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
        username: '',
        password: ''
    };
    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.sendPostRequest = this.sendPostRequest.bind(this);
    this.sendPostRequest2 = this.sendPostRequest2.bind(this);
    this.sendPostRequest3 = this.sendPostRequest3.bind(this);
  }
  sendPostRequest() {
    fetch('/login', {
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
      console.log("/login");
      console.log(data);
    })
  }
  sendPostRequest2() {
    fetch('/login/50', {
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
      console.log("/login/50");
      console.log(data);
    })
  }
  sendPostRequest3() {
    fetch('/login/50/60', {
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
      console.log("/login/50/60");
      console.log(data);
    })
  }
  handleChangeUsername(e) {
      this.setState({username: e.target.value});
  }
  handleChangePassword(e) {
      this.setState({password: e.target.value});
  }
  handleSubmit(e) {
      e.preventDefault();
      this.sendPostRequest();
      console.log("Submitted");
  }
  render() {
    return (
      <Row>
          <Col md={2} lg={2}/>
          <Col md={8} lg={8}>
            <Paper style={styles.container}>
              <h1 style={styles.title}>Login</h1>
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
              <RaisedButton label="login" primary={true} style={styles.submitButton}
                onClick={this.sendPostRequest}/>
              <RaisedButton label="login/50" primary={true} style={styles.submitButton}
                onClick={this.sendPostRequest2}/>
              <RaisedButton label="login/50/60" primary={true} style={styles.submitButton}
                onClick={this.sendPostRequest3}/>
            </Paper>
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
    margin: 12
  },
  title: {
      fontFamily: 'Nunito, sans-serif',
      fontWeight: '700',
      fontSize: '32px',
      marginTop: '10px'
  }
}
