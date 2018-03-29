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
    this.getFilteredData = this.getFilteredData.bind(this);
    this.handleOpenDetailDialog = this.handleOpenDetailDialog.bind(this);
    this.handleCloseDetailDialog = this.handleCloseDetailDialog.bind(this);
    this.handleOpenCommentDialog = this.handleOpenCommentDialog.bind(this);
    this.handleCloseCommentDialog = this.handleCloseCommentDialog.bind(this);
    this.handleAddComment = this.handleAddComment.bind(this);
  }
  getTempData() {
    var data = {"ID1":{"Post": "Is there an exam tomorrow?" ,"Desc": "I am having a conflict. Do we have an exam tomorrow?", "TAG": "Exam", "VOTE": 10, "Time":"03-08-2018", "Author": "Alice"},
  	"ID2":{"Post": "What's SQLITE?" ,"Desc": "What's the best resource?", "TAG": "Project 1", "VOTE": 10, "Time":"03-06-2018", "Author": "Sihan"},
  	"ID3":{"Post": "Can we use Sqlite?" ,"Desc": "Wondering if we can use it or not", "TAG": "Project 1", "VOTE": 10, "Time":"03-05-2018", "Author": "Karthik"},
  	"ID4":{"Post": "What's difference betwen MongoDb and Sqlite?" ,"Desc": "Both seems cool.", "TAG": "Project 1", "VOTE": 10, "Time":"03-04-2018", "Author": "Miles"},
  	"ID5":{"Post": "Do we need to finish it before due date?" ,"Desc": "I am lazy.", "TAG": "Exam", "VOTE": 10, "Time":"03-03-2018", "Author": "Alice"},
  	"ID6":{"Post": "Is it necessary to do epic frontend for project?" ,"Desc": "I am a React fan.", "TAG": "Just Alice Things", "VOTE": 10, "Time":"03-02-2018", "Author": "Alice"},
  	"ID7":{"Post": "Should I join Google or GS?" ,"Desc": "I am confused!!!", "TAG": "Just Alice Things", "VOTE": 10, "Time":"03-01-2018", "Author": "Alice"}}
    return data;
  }
  getFilteredData() {
    var data = _.values(this.getTempData());
    if (this.state.filter == "All") return data;
    var data = [];
    _.forEach (this.getTempData(), function(value, key) {
      if (value.TAG == this.state.filter) {
        data.push(value);
      };
    }.bind(this));
    return data;
  }
  handleFilter(tag, e) {
    e.preventDefault();
    this.setState({filter: tag});
    console.log(tag);
  }
  handleOpenDetailDialog(post, e) {
    e.preventDefault();
    this.setState({openDetailDialog: true});
    this.setState({currentPost: post})
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
      var ava = <Avatar>{value.Author[0]}</Avatar>
      posts.push (
        <div style={styles.cardContainer}>
          <Card>
            <CardHeader
              title={value.Post}
              subtitle={value.VOTE + " votes • " + value.Time}
              avatar={ava}
              actAsExpander={false}
              showExpandableButton={false}
            />
            <CardText expandable={false}>
              {value.Desc}
            </CardText>
            <CardActions>
              <RaisedButton label="more" primary={true} onClick={this.handleOpenDetailDialog.bind(this, value)} style={styles.rightButton}/>
            </CardActions>
          </Card>
        </div>
      )
    }.bind(this));
    var tags = _.map(this.getTempData(), function(value, key) {
      return value.TAG;
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
          iconElementRight={<RaisedButton label="Login" style={styles.rightButton}/>}
          style={styles.appbar}
        />
        <div style={styles.tagPanel}>
          {tagButtons}
        </div>
        <div style={styles.postBoard}>
          {posts}
        </div>
        <Dialog
          title= {this.state.currentPost == null ? "Post" : this.state.currentPost.Post}
          actions={detailActions}
          modal={false}
          open={this.state.openDetailDialog}
          onRequestClose={this.handleCloseDetailDialog}
          autoScrollBodyContent={true}
        >
          <p>{this.state.currentPost == null ? "Details" : this.state.currentPost.Desc}</p>
        </Dialog>
        <Dialog
          title= {this.state.currentPost == null ? "Post" : this.state.currentPost.Post}
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
