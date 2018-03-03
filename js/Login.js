import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import {Grid, Row, Col} from 'react-flexbox-grid/lib/index';
import 'whatwg-fetch';

export default class Login extends Component {
  constructor() {
    super();
    fetch('/login', {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Hubot',
        login: 'hubot',
      })
    }).then(function(res) {
      console.log(res);
    })
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
              /><br/>
              <TextField
                floatingLabelText="Password"
                type="password"
              /><br/>
              <TextField
                floatingLabelText="Email"
              /><br/>
              <TextField
                floatingLabelText="Full name"
              /><br/>
              <div>
                <RadioButtonGroup name="Role" defaultSelected="student">
                  <RadioButton
                    value="student"
                    label="Student"
                    style={styles.radioButton}
                  />
                  <RadioButton
                    value="instructor"
                    label="Instructor"
                    style={styles.radioButton}
                  />
                </RadioButtonGroup>
              </div>
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
  title: {
      fontFamily: 'Nunito, sans-serif',
      fontWeight: '700',
      fontSize: '32px',
      marginTop: '10px'
  }
};
