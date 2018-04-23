import React, { Component } from 'react';
import { Link, Router } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import Avatar from 'material-ui/Avatar';
import {Card, CardActions, CardHeader, CardTitle, CardText} from 'material-ui/Card';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

export default class PostDetailPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postDetails: null,
      showAddBox: false,
      answer: ''
    };
    this.handleChangeAnswer = this.handleChangeAnswer.bind(this);
    this.handleAddAnswer = this.handleAddAnswer.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.fetchPostDetail = this.fetchPostDetail.bind(this);
  }
  componentDidMount() {
    this.fetchPostDetail();
  }
  fetchPostDetail() {
    fetch('/posts/' + this.props.match.params.pid + '?cid=1', {
      credentials: 'include',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
      },
    }).then(function(res) {
      return res.json();
    }).then(function(data) {
      console.log("postdetail data");
      console.log(data);
      this.setState({postDetails: data});
    }.bind(this))
  }
  handleChangeAnswer(e) {
    this.setState({answer: e.target.value});
  }
  handleAddAnswer() {
    if (this.state.showAddBox == false) {
      this.setState({showAddBox: true});
    }
    else {
      fetch('/posts/' + this.props.match.params.pid + '/answer', {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
        },
        body: JSON.stringify({
          type: 'login',
          username: localStorage.getItem('username'),
          answer: this.state.answer
        })
      }).then(function(res) {
        return res.json();
      }).then(function(data) {
        console.log("Add answer response");
        console.log(data);
        if (data.status == 1) {
          this.setState({showAddBox: false});
          this.setState({answer: ''});
          this.fetchPostDetail();
        }
        else {
          console.log("Something went wrong.")
        }
      }.bind(this))
    }
  }
  handleCancel() {
    this.setState({showAddBox: false});
  }
  render() {
    var postContainer = null;
    if (this.state.postDetails != null) {
      var data = this.state.postDetails;
      // var ava = data == null ? <Avatar>?</Avatar> : <Avatar>{data.post.author[0]}</Avatar>
      // subtitle={data.post.vote + " votes • " + data.post.time}
      var replies = [];
      _.forEach(data.post.replies, function(value) {
        var ava = <Avatar>{value.author[0]}</Avatar>
        replies.push (
          <div style={styles.cardContainer}>
            <Card>
              <CardHeader
                title={value.author}
                subtitle={value.vote + " votes • " + value.time}
                avatar={ava}
                actAsExpander={false}
                showExpandableButton={false}
              />
              <CardTitle expandable={false}>
                {value.answer}
              </CardTitle>
            </Card>
          </div>
        )
      }.bind(this));

      var ava = <Avatar>{localStorage.getItem('username')[0]}</Avatar>
      var addBox = (
        <Card style={styles.addBox}>
          <CardHeader
            title={localStorage.getItem('username')}
            avatar={ava}
            actAsExpander={false}
            showExpandableButton={false}
          />
          <CardTitle expandable={false}>
            <TextField
              hintText="Type your answer here"
              floatingLabelText="Type your answer here"
              multiLine={true}
              rows={1}
              fullWidth={true}
              value={this.state.answer}
              onChange={this.handleChangeAnswer}
            />
          </CardTitle>
        </Card>
      )
      postContainer = (
        <div style={styles.postContainer}>
          <h1>Question</h1>
          <Card>
            <CardHeader
              title={data.post.header}
              avatar={<Avatar>?</Avatar>}
              actAsExpander={false}
              showExpandableButton={false}
            />
            <CardTitle expandable={false}>
              {data.post.description}
            </CardTitle>
          </Card>
          <h1>Answers</h1>
          {replies}
          {this.state.showAddBox ? addBox : null}
          <RaisedButton label={this.state.showAddBox ? "Submit" : "Add Answer"} primary={true} onClick={this.handleAddAnswer} style={styles.addAnsButton} />
          {this.state.showAddBox ? <RaisedButton label="Cancel" onClick={this.handleCancel} style={styles.addAnsButton} /> : null}
        </div>)
    }

    return (
      <div>
        <AppBar
          title="Zocalo"
          onTitleClick={(e) => {console.log("eh")}}
          iconElementRight={<RaisedButton label="Login" onClick={()=>{this.props.history.push('/Loginpage');}} style={styles.rightButton}/>}
          style={styles.appbar}
        />
        {postContainer}
      </div>
    )
  }
}

const styles = {
  appbar: {
    position: 'fixed',
    top: '0'
  },
  rightButton: {
    marginTop: '6px',
    marginRight: '12px'
  },
  postContainer: {
    margin: '96px 24px 0px 24px'
  },
  cardContainer: {
    margin: '18px 0px'
  },
  addBox: {
    marginBottom: '18px',
  },
  addAnsButton: {
    marginRight: '18px'
  }
}
