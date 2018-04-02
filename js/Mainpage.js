import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Avatar from 'material-ui/Avatar';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import Dialog from 'material-ui/Dialog';
import Drawer from 'material-ui/Drawer';
import FlatButton from 'material-ui/FlatButton';
import { Link, Router } from 'react-router-dom';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import {Grid, Row, Col} from 'react-flexbox-grid/lib/index';
import SearchBar from './SearchBar';
var _ = require('lodash');
export default class Mainpage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: "All",
      openDetailDialog: false,
      openCommentDialog: false,
      currentPost: null
    };
    this.handleFilter = this.handleFilter.bind(this);
    this.getPostData = this.getPostData.bind(this);
    this.getFilteredData = this.getFilteredData.bind(this);
    this.handleOpenDetailDialog = this.handleOpenDetailDialog.bind(this);
    this.handleCloseDetailDialog = this.handleCloseDetailDialog.bind(this);
    this.handleOpenCommentDialog = this.handleOpenCommentDialog.bind(this);
    this.handleCloseCommentDialog = this.handleCloseCommentDialog.bind(this);
    this.handleAddComment = this.handleAddComment.bind(this);
    this.getPostDetailComponents = this.getPostDetailComponents.bind(this);
  }
  getPostData() {
    var data = { "status":1,
      "message":"Success",
    	"posts":
    	[{"pid":41,"header": "Is there an exam tomorrow?" ,"summary": "I am having a conflict. Do we have an exam tomorrow?", "tags": ["Exam"], "vote": 10, "time":"03-08-2018", "author": "Alice"},
    	{"pid":51, "header": "What's SQLITE?" ,"summary": "What's the best resource?", "tags": ["Project 1", "Homework1"], "vote": 10, "time":"03-06-2018", "author": "Sihan"},
    	{"pid":63, "header": "Can we use Sqlite?" ,"summary": "Wondering if we can use it or not", "tags": ["Project 1", "Homework1"], "vote": 10, "time":"03-05-2018", "author": "Karthik"},
    	{"pid":67, "header": "What's difference betwen MongoDb and Sqlite?" ,"summary": "Both seems cool.", "tags": ["Project 1", "Homework1"], "vote": 10, "time":"03-04-2018", "author": "Miles"},
    	{"pid":12, "header": "Do we need to finish it before due date?" ,"summary": "I am lazy.", "tags": [], "vote": 10, "time":"03-03-2018", "author": "Alice"},
    	{"pid":44, "header": "Is it necessary to do epic frontend for project?" ,"summary": "I am a React fan.", "tags": ["Just Alice Things"], "vote": 10, "time":"03-02-2018", "author": "Alice"},
    	{"pid":21, "header": "Should I join Google or GS?" ,"summary": "I am confused!!!", "tags": ["Just Alice Things"], "vote": 10, "time":"03-01-2018", "author": "Alice"}]
    }

  	return data;
  }
  getFilteredData() {
    var data = this.getPostData().posts;
    if (this.state.filter == "All") return data;
    var data = [];
    _.forEach (this.getPostData().posts, function(value) {
      if (value.tags.includes(this.state.filter)) {
        data.push(value);
      };
    }.bind(this));
    return data;
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
  getPostDetailComponents() {
    console.log("called");
    var answers = [];
    if (this.state.currentPost != null) {
      _.forEach(this.state.currentPost.replies, function(value) {
        var ava = <Avatar>{value.author[0]}</Avatar>
        answers.push (
          <div style={styles.cardContainer}>
            <Card>
              <CardHeader
                title={value.answer}
                subtitle={value.vote + " votes • " + value.time}
                avatar={ava}
                actAsExpander={false}
                showExpandableButton={false}
              />
            </Card>
          </div>
        )
      }.bind(this));
    }
    console.log(this.state.currentPost);
    return answers;
  }
  handleFilter(tag, e) {
    e.preventDefault();
    this.setState({filter: tag});
    console.log(tag);
  }
  handleOpenDetailDialog(post, e) {
    e.preventDefault();
    var postDetail = this.getPostDetailData();
    //console.log(this.getPostDetailData());
    this.setState({openDetailDialog: true});
    this.setState({currentPost: postDetail});
    //console.log(this.currentPost);
    this.forceUpdate();
  }
  handleCloseDetailDialog(e) {
    this.setState({openDetailDialog: false});
    this.setState({currentPost: null});
  }
  handleOpenCommentDialog(e) {
    e.preventDefault();
    this.setState({openCommentDialog: true});
  }
  handleCloseCommentDialog(e) {
    e.preventDefault();
    this.setState({openCommentDialog: false});
  }
  handleAddComment() {
    console.log("Comment added.");
  }
  render() {
    var posts = [];
    _.forEach(this.getFilteredData(), function(value) {
      var ava = <Avatar>{value.author[0]}</Avatar>
      posts.push (
        <div style={styles.cardContainer}>
          <Card>
            <CardHeader
              title={value.header}
              subtitle={value.vote + " votes • " + value.time}
              avatar={ava}
              actAsExpander={false}
              showExpandableButton={false}
            />
            <CardText expandable={false}>
              {value.summary}
            </CardText>
            <CardActions>
              <RaisedButton label="more" primary={true} onClick={this.handleOpenDetailDialog.bind(this, value)} style={styles.rightButton}/>
            </CardActions>
          </Card>
        </div>
      )
    }.bind(this));

    var tags = [];
    _.forEach(this.getPostData().posts, function(value) {
      tags = tags.concat(value.tags);
    });
    var tags = _.uniq(tags);
    var tagButtons = tags.map((tag)=>(<RaisedButton label={tag} primary={true} onClick={this.handleFilter.bind(this, tag)} style={styles.tagButton} />));
    tagButtons.unshift(<RaisedButton label="All" primary={true} onClick={this.handleFilter.bind(this, "All")} style={styles.tagButton} />)

    const customTitle = (
      <div>
        <h1 style={styles.title}>Zocalo</h1>
        <div style={styles.testSearchBar}>
          <SearchBar />
        </div>
      </div>);

    const detailActions = [
      <FlatButton
        label="Add comment"
        primary={true}
        onClick={this.handleOpenCommentDialog}
      />,
      <FlatButton
        label="Close"
        primary={true}
        onClick={this.handleCloseDetailDialog}
      />,
    ];

    const commentActions = [
      <FlatButton
        label="OK"
        primary={true}
        onClick={this.handleAddComment}
      />,
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleCloseCommentDialog}
      />,
    ];
    return (
      <div>
        <AppBar
          title={customTitle}
          iconElementRight={<RaisedButton label="Login" onClick={()=>{this.props.history.push('/Loginpage');}} style={styles.rightButton}/>}
          style={styles.appbar}
        />
        <div style={styles.tagPanel}>
          {tagButtons}
        </div>
        <div style={styles.postBoard}>
          {posts}
        </div>
        <Dialog
          title= {this.state.currentPost == null ? "Header" : this.state.currentPost.post.header}
          actions={detailActions}
          modal={false}
          open={this.state.openDetailDialog}
          onRequestClose={this.handleCloseDetailDialog}
          autoScrollBodyContent={true}
        >
          <p>{this.state.currentPost == null ? "Details" : this.state.currentPost.post.description}</p>
          {this.getPostDetailComponents()}
        </Dialog>
        <Dialog
          title= {this.state.currentPost == null ? "Header" : this.state.currentPost.post.header}
          actions={commentActions}
          modal={false}
          open={this.state.openCommentDialog}
          onRequestClose={this.handleCloseCommentDialog}
        >
          <p>Add comment</p>
        </Dialog>
      </div>

    )
  }
}
const styles = {
  div: {
    height: '40px',
    backgroundColor: 'green'
  },
  appbar: {
    position: 'fixed',
    top: '0'
  },
  tagPanel: {
    width: '256px',
    height: '100%',
    float: 'left',
    padding: '99px 10px 35px 10px'
  },
  tagButton: {
    width: '192px',
    margin: '12px'
  },
  postBoard: {
    padding: '99px 20px 35px 276px'
  },
  cardContainer: {
    padding: '10px 0px'
  },
  rightButton: {
    marginTop: '6px'
  },
  title: {
    float: 'left',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    margin: '0px',
    paddingTop: '0px',
    letterSpacing: '0px',
    fontSize: '24px',
    fontWeight: 400,
    height: '64px',
    width: '212px',
    lineHeight: '64px',
    flex: '1 1 0%'
  },
  searchBar: {
    color: 'black',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  testSearchBar: {

  },
  barcontent: {
    color: 'black'
  }
}
