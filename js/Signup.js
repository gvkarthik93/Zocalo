import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import RaisedButton from 'material-ui/RaisedButton';
import {Grid, Row, Col} from 'react-flexbox-grid/lib/index';
import {BrowserRouter as Router, Link} from 'react-router-dom';
import 'whatwg-fetch';

export default class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
        username: '',
        password: '',
        retypepass:'',
        email: '',
        fullname: ''
    };
    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleChangeRetypePass = this.handleChangeRetypePass.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangeFullName = this.handleChangeFullName.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  sendPostRequest() {
    //Change to post to signup
    fetch('access/signup', {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'signup',
        username: this.state.username,
        password: this.state.password,
        email: this.state.email,
        name: this.state.fullname
      })
    }).then(function(res) {
      console.log(res);
    }).then(function(data) {
      console.log(data);
      this.props.history.push('/MainPage');
    //   if (data.status == 0) {
    //     console.log("Signup unsuccessful.");
    //   }
    //   else if (data.status == 1) {
    //     this.props.history.push('/MainPage');
    //   }
    // }.bind(this))
  }
  validateEmail() {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(this.state.email);
  }
  handleChangeUsername(e) {
    this.setState({username: e.target.value});
  }
  handleChangePassword(e) {
      this.setState({password: e.target.value});
  }
  handleChangeRetypePass(e) {
      this.setState({retypepass: e.target.value});
  }
  handleChangeEmail(e) {
      this.setState({email: e.target.value});
  }
  handleChangeFullName(e) {
      this.setState({fullname: e.target.value});
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
              <h1 style={styles.title}>Signup</h1>
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
                <TextField
                  floatingLabelText="Retype Password"
                  type="password"
                  value={this.state.retypepass}
                  onChange={this.handleChangeRetypePass}
                  errorText={this.state.retypepass == this.state.password || this.state.retypepass == "" ? null : "Retyped password is different from your password!"}
                /><br/>
                <TextField
                  floatingLabelText="Email"
                  type="email"
                  value={this.state.email}
                  onChange={this.handleChangeEmail}
                  errorText={this.validateEmail() || this.state.email == "" ? null : "Please enter a valid email."}
                /><br/>
                <TextField
                  floatingLabelText="Full name"
                  value={this.state.fullname}
                  onChange={this.handleChangeFullName}
                /><br/>
                <div style={{marginTop: 20, marginBottom: 15, textAlign: 'center', fontSize: 13, color: '#ccc'}}>
                  <Link to="/LoginPage">Already have an account? Login here.</Link>
                </div>
                <RaisedButton label="Signup" primary={true} style={styles.submitButton}
                  type="submit"
                  disabled={this.state.username == ""
                  || this.state.password == ""
                  || this.state.email == ""
                  || this.validateEmail() == false
                  || this.state.fullname == ""
                  || this.state.password != this.state.retypepass ? true : false}/>
              </form>
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
