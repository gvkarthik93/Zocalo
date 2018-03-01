import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import {Row, Col} from 'react-flexbox-grid/lib/index';

export default class Login extends Component {
  render() {
    return (
      <Row>
          <Col md={2} lg={2}/>
          <Col xs={12} md={8} lg={2}>
            <Paper style={styles.container}>
              <TextField
                floatingLabelText="Username"
              /><br/>
              <TextField
                floatingLabelText="Password"
              /><br/>
              <TextField
                floatingLabelText="Email"
              /><br/>
              <TextField
                floatingLabelText="Full name"
              /><br/>
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
    width: 650,
    padding: '35px 15px',
  },
  radioButton: {
    marginBottom: 16,
  },
};
