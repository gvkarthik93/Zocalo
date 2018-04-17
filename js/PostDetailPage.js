import React, { Component } from 'react';
import { Link, Router } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import Avatar from 'material-ui/Avatar';
import {Card, CardActions, CardHeader, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';

export default class PostDetailPage extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //
    // };
    // this.handleFilter = this.handleFilter.bind(this);
    this.getPostDetailData = this.getPostDetailData.bind(this);
  }
  getPostDetailData() {
    var data = {
      "status":1,
  	  "message":"Success",
  		"post": {
  			"pid":52,
  			"header":"When is the exam and where is it?",
  			"description":"(D)I need the exact date and location for the exam.",
  			"tags":["Exam","Logistics","Other"],
        "vote": 15,
        "time": "03-06-2018",
        "author": "Alice",
  			"replies":
  			[{"rid":0, "author":"Sihan", "time": "2018-03-31 20:40:00", "vote": 3, "answer":"Today is a good day for exam."},
  			{"rid":1, "author":"Jack", "time": "2018-03-31 21:40:00", "vote": 5, "answer":"I believe it's in Gates G01, maybe I am wrong, can some TA confirm this?"},
  			{"rid":2, "author":"Jane", "time": "2018-03-31 22:40:00", "vote": 11, "answer":"Disagree with the last post, I believe it's in startler 101. Correct me if I am wrong."},
  			{"rid":3, "author":"Peter", "time": "2018-03-31 23:40:00", "vote": 22, "answer":"Disagree again with the reply above. It's a take home exam."},
  			{"rid":4, "author":"Dan", "time": "2018-03-31 23:41:00", "vote": 0, "answer":"I don't know"},
  			{"rid":5, "author":"Lilly", "time": "2018-03-31 23:46:22", "vote": 1, "answer":"Agree with floor 4."}]
  		}
  	}

  	return data
  }
  render() {
    console.log(this.props.match.params.pid);
    var data = this.getPostDetailData();
    var ava = <Avatar>{data.post.author[0]}</Avatar>

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

    return (
      <div>
        <AppBar
          title="Zocalo"
          onTitleClick={(e) => {console.log("eh")}}
          iconElementRight={<RaisedButton label="Login" onClick={()=>{this.props.history.push('/Loginpage');}} style={styles.rightButton}/>}
          style={styles.appbar}
        />
        <div style={styles.postContainer}>
          <h1>Question</h1>
          <Card>
            <CardHeader
              title={data.post.header}
              subtitle={data.post.vote + " votes • " + data.post.time}
              avatar={ava}
              actAsExpander={false}
              showExpandableButton={false}
            />
            <CardTitle expandable={false}>
              {data.post.description}
            </CardTitle>
          </Card>
          <h1>Answers</h1>
          {replies}
        </div>
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
  }
}
