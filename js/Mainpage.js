import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Avatar from 'material-ui/Avatar';
import {Card, CardActions, CardHeader, CardTitle, CardText} from 'material-ui/Card';
import Dialog from 'material-ui/Dialog';
import Drawer from 'material-ui/Drawer';
import FlatButton from 'material-ui/FlatButton';
import { Link, Router } from 'react-router-dom';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
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
      currentPost: null,
      sort: null
    };
    this.handleFilter = this.handleFilter.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.getPostData = this.getPostData.bind(this);
    this.getFilteredData = this.getFilteredData.bind(this);
    this.handleOpenDetailDialog = this.handleOpenDetailDialog.bind(this);
    this.handleCloseDetailDialog = this.handleCloseDetailDialog.bind(this);
    this.handleOpenCommentDialog = this.handleOpenCommentDialog.bind(this);
    this.handleCloseCommentDialog = this.handleCloseCommentDialog.bind(this);
    this.handleAddComment = this.handleAddComment.bind(this);
    this.getPostDetailComponents = this.getPostDetailComponents.bind(this);
  }
  // componentDidMount() {
  //   fetch('posts', {
  //     credentials: 'include',
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({
  //       type: 'login',
  //       username: this.state.username,
  //       password: this.state.password
  //     })
  //   }).then(function(res) {
  //     return res.json();
  //   }).then(function(data) {
  //     console.log(data);
  //     if (data.status == 0) {
  //       console.log("no username found.");
  //       this.setState({open: true});
  //     }
  //     else if (data.status == 1) {
  //       this.props.history.push('/MainPage');
  //     }
  //   }.bind(this))
  // }
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
  getPostDetailComponents() {
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
  handleSort(e, index, value) {
    this.setState({sort: value});
  }
  handleOpenDetailDialog(pid, e) {
    e.preventDefault();
    // var win = window.open('/PostDetailPage/posts/'+pid, '_blank');
    // var win = window.open('/MainPage', '_blank');
    // win.focus();

    this.props.history.push('/PostDetailPage/posts/'+pid);
    // var postDetail = this.getPostDetailData();
    //console.log(this.getPostDetailData());
    // this.setState({openDetailDialog: true});
    // this.setState({currentPost: postDetail});
    //console.log(this.currentPost);
    // this.forceUpdate();
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
    console.log(this.props.currentUser);
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
            <CardTitle expandable={false}>
              {value.summary}
            </CardTitle>
            <CardActions>
              <RaisedButton label="more" primary={true} onClick={this.handleOpenDetailDialog.bind(this, value.pid)} style={styles.rightButton}/>
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
        <a onClick={(e) => {this.props.history.push('/MainPage')}} style={styles.title}>Zocalo</a>
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
          <RaisedButton label="Create post" primary={true} style={styles.createPostButton}/>
          <SelectField
            value={this.state.sort}
            onChange={this.handleSort}
            floatingLabelText="Sort By"
            style={styles.sortDropdown}
          >
            <MenuItem key={1} value={1} primaryText="Time" />
            <MenuItem key={2} value={2} primaryText="Votes" />
          </SelectField>
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
    marginTop: '6px',
    marginRight: '12px'
  },
  createPostButton: {
    marginTop: '12px',
    marginBottom: '6px',
  },
  sortDropdown: {
    marginTop: '-18px',
    float: 'right'
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
    flex: '1 1 0%',
    cursor: 'pointer'
  },
  searchBar: {
    color: 'black',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  barcontent: {
    color: 'black'
  }
}
