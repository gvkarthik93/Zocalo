import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Avatar from 'material-ui/Avatar';
import {Card, CardActions, CardHeader, CardTitle, CardText} from 'material-ui/Card';
import Chip from 'material-ui/Chip';
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
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import Edit from 'material-ui/svg-icons/image/edit';
import Delete from 'material-ui/svg-icons/action/delete';
import Thumbup from 'material-ui/svg-icons/action/thumb-up';
import Thumbdown from 'material-ui/svg-icons/action/thumb-down';

var _ = require('lodash');
export default class Mainpage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: "All",
      sort: "time",
      posts: null,
      showAddBox: false,
      showCreateBox: false,
      showEditBox: false,
      openDeleteDialog: false,
      createPostForm: {
        header: "",
        description: "",
        visibility: "public",
        postType: "question"
      },
      actionPid: 0,
      username: null
    };
    this.fetchPosts = this.fetchPosts.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.getFilteredData = this.getFilteredData.bind(this);
    this.handleOpenDetailPage = this.handleOpenDetailPage.bind(this);
    this.handleCreatePost = this.handleCreatePost.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleChangeHeader = this.handleChangeHeader.bind(this);
    this.handleChangeDescription = this.handleChangeDescription.bind(this);
    this.handleChangeVisibility = this.handleChangeVisibility.bind(this);
    this.handleChangePostType = this.handleChangePostType.bind(this);
    this.handleOpenDeleteDialog = this.handleOpenDeleteDialog.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleVote = this.handleVote.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }
  componentDidMount() {
    var username = localStorage.getItem('username') ? localStorage.getItem('username') : null;
    if (username == null) {
      this.props.history.push('/LoginPage');
    }
    else {
      this.setState({username: username});
      this.fetchPosts();
    }
  }
  fetchPosts() {
    if (localStorage.getItem('jwtToken')) {
      fetch('posts?cid=1', {
        credentials: 'include',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
        },
      }).then(function(res) {
        return res.json();
      }).then(function(data) {
        console.log(data);
        this.setState({posts: data.posts});
      }.bind(this))
    }
    else {
      console.log("You are not logged in.");
    }
  }
  getFilteredData() {
    var data = this.state.posts;
    if (this.state.filter == "All") return data;
    var data = [];
    _.forEach (this.state.posts, function(value) {
      if (value.tags.includes(this.state.filter)) {
        data.push(value);
      };
    }.bind(this));
    return data;
  }
  handleChangeHeader(e) {
    this.state.createPostForm.header = e.target.value;
    this.setState({createPostForm: this.state.createPostForm});
  }
  handleChangeDescription(e) {
    this.state.createPostForm.description = e.target.value;
    this.setState({createPostForm: this.state.createPostForm});
  }
  handleChangeVisibility(e, index, value) {
    this.state.createPostForm.visibility = value;
    this.setState({createPostForm: this.state.createPostForm});
  }
  handleChangePostType(e, index, value) {
    this.state.createPostForm.postType = value;
    this.setState({createPostForm: this.state.createPostForm});
  }
  handleCreatePost() {
    if (!this.state.showCreateBox) {
      this.setState({showCreateBox: true});
    }
    else {
      fetch('/posts', {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
        },
        body: JSON.stringify({
          type: 'login',
          header: this.state.createPostForm.header,
          description: this.state.createPostForm.description,
          author: this.state.username,
          course_id: 1,
          visibility: this.state.createPostForm.visibility,
          post_type: this.state.createPostForm.postType
        })
      }).then(function(res) {
        return res.json();
      }).then(function(data) {
        console.log("Create post response");
        console.log(data);
        if (data.status == 1) {
          this.setState({showCreateBox: false});
          this.state.createPostForm = {
            header: "",
            description: "",
            visibility: "public",
            postType: "question"
          }
          this.setState({createPostForm: this.state.createPostForm});
          this.fetchPosts();
        }
        else {
          console.log("Something went wrong.")
        }
      }.bind(this))
    }
  }
  handleCancel() {
    this.setState({showCreateBox: false});
    this.setState({showEditBox: false});
    this.setState({openDeleteDialog: false});
    this.state.createPostForm = {
      header: "",
      description: "",
      visibility: "public",
      postType: "question"
    }
    this.setState({createPostForm: this.state.createPostForm});
  }
  handleFilter(tag, e) {
    e.preventDefault();
    this.setState({filter: tag});
  }
  handleSort(e, index, value) {
    this.setState({sort: value});
  }
  handleOpenDetailPage(pid, e) {
    e.preventDefault();
    this.props.history.push('/PostDetailPage/posts/'+pid);
  }
  handleOpenDeleteDialog(pid, e) {
    this.setState({openDeleteDialog: true});
    this.setState({actionPid: pid});
  }
  handleShowEdit(pid, header, description, visibility, post_type, e) {
    console.log(visibility);
    this.setState({showEditBox: true});
    this.setState({actionPid: pid});
    const createPostForm = {
      header: header,
      description: description,
      visibility: visibility,
      postType: post_type
    }
    this.setState({createPostForm: createPostForm});
  }
  handleEdit() {
    fetch('/posts/' + this.state.actionPid, {
      credentials: 'include',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
      },
      body: JSON.stringify({
        username: this.state.username,
        header: this.state.createPostForm.header,
        description: this.state.createPostForm.description,
        visibility: this.state.createPostForm.visibility
      })
    }).then(function(res) {
      return res.json();
    }).then(function(data) {
      console.log("Edit post response");
      console.log(data);
      if (data.status == 1) {
        this.setState({showEditBox: false});
        const createPostForm = {
          header: "",
          description: "",
          visibility: "public",
          postType: "question"
        };
        this.setState({createPostForm: createPostForm});
        this.fetchPosts();
      }
      else {
        console.log("Something went wrong.")
      }
    }.bind(this))
  }
  handleDelete() {
    fetch('/posts/' + this.state.actionPid, {
      credentials: 'include',
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
      }
    }).then(function(res) {
      return res.json();
    }).then(function(data) {
      console.log("Delete post response");
      console.log(data);
      if (data.status == 1) {
        this.fetchPosts();
        this.setState({openDeleteDialog: false});
      }
      else {
        console.log("Something went wrong.")
      }
    }.bind(this))
  }
  handleVote(pid, type, e) {
    fetch('/posts/' + pid + '/vote', {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
      },
      body: JSON.stringify({
        type: type
      })
    }).then(function(res) {
      return res.json();
    }).then(function(data) {
      if (data.status == 1) {
        this.fetchPosts();
        console.log(pid + " " + type + "voted.");
      }
      else {
        console.log(data);
      }
    }.bind(this))
  }
  handleLogout() {
    localStorage.removeItem('username');
    localStorage.removeItem('jwtToken');
    this.props.history.push('/LoginPage');
  }
  render() {
    var posts = [];
    var postData = this.getFilteredData();
    // Sort posts
    if (this.state.sort == "time") {
      console.log(postData);
      postData = _.orderBy(postData, ['time'], ['desc']);
    }
    else if (this.state.sort == "vote") {
      postData = _.orderBy(postData, ['vote'], ['desc']);
    }
    
    _.forEach(postData, function(value) {
      var ava = <Avatar>{value.author[0]}</Avatar>;
      var tags = value.tags.map((tag) => (<Chip onClick={this.handleFilter.bind(this,tag)} style={styles.chip}>{tag}</Chip>));
      posts.push (
        <div style={styles.cardContainer}>
          <Card style={value.visibility == "private" ? styles.privateCard : null}>
            <CardHeader
              title={value.header}
              subtitle={value.vote + " votes • " + value.time}
              avatar={ava}
              actAsExpander={false}
              showExpandableButton={false}
            />
            <CardTitle expandable={false}>
              {value.description}
              <div style={styles.wrapper}>{tags}</div>
            </CardTitle>
            {value.author == this.state.username ?
              (<CardActions>
                <RaisedButton label="more" primary={true} onClick={this.handleOpenDetailPage.bind(this, value.pid)} style={styles.rightButton}/>
                <IconButton tooltip="edit">
                  <Edit onClick={this.handleShowEdit.bind(this, value.pid, value.header, value.description, value.visibility, value.post_type)}/>
                </IconButton>
                <IconButton tooltip="delete">
                  <Delete onClick={this.handleOpenDeleteDialog.bind(this, value.pid)}/>
                </IconButton>
                <IconButton tooltip="up-vote">
                  <Thumbup onClick={this.handleVote.bind(this, value.pid, 'up')}/>
                </IconButton>
                <IconButton tooltip="down-vote">
                  <Thumbdown onClick={this.handleVote.bind(this, value.pid, 'down')}/>
                </IconButton>
              </CardActions>) :
              (<CardActions>
                <RaisedButton label="more" primary={true} onClick={this.handleOpenDetailPage.bind(this, value.pid)} style={styles.rightButton}/>
                <IconButton tooltip="up-vote">
                  <Thumbup onClick={this.handleVote.bind(this, value.pid, 'up')}/>
                </IconButton>
                <IconButton tooltip="up-vote">
                  <Thumbdown onClick={this.handleVote.bind(this, value.pid, 'down')}/>
                </IconButton>
              </CardActions>)
            }
          </Card>
        </div>
      )
    }.bind(this));

    var tags = [];
    _.forEach(this.state.posts, function(value) {
      tags = tags.concat(value.tags);
    });
    var tags = _.uniq(tags);
    var tagButtons = tags.map((tag)=>(<RaisedButton label={tag} primary={this.state.filter == tag} onClick={this.handleFilter.bind(this, tag)} style={styles.tagButton} />));
    tagButtons.unshift(<RaisedButton label="All" primary={this.state.filter == "All"} onClick={this.handleFilter.bind(this, "All")} style={styles.tagButton} />)

    const customTitle = (
      <div>
        <a onClick={(e) => {this.props.history.push('/MainPage')}} style={styles.title}>Zocalo</a>
        <div style={styles.testSearchBar}>
          <SearchBar />
        </div>
      </div>);
    var ava = <Avatar>{this.state.username != null ? this.state.username[0] : null}</Avatar>
    var createBox = (
      <div style={styles.postBoard}>
        <Card style={styles.createBox}>
          <CardHeader
            title={this.state.username != null ? this.state.username : null}
            avatar={ava}
            actAsExpander={false}
            showExpandableButton={false}
          />
          <CardTitle expandable={false}>
            <TextField
              hintText="Type your question summary here"
              floatingLabelText="Summary"
              rows={1}
              fullWidth={true}
              value={this.state.createPostForm.header}
              onChange={this.handleChangeHeader}
            />
            <TextField
              hintText="Type your question details here"
              floatingLabelText="Description"
              multiLine={true}
              rows={3}
              fullWidth={true}
              value={this.state.createPostForm.description}
              onChange={this.handleChangeDescription}
            />
            <SelectField
              floatingLabelText="Post Type"
              value={this.state.createPostForm.postType}
              onChange={this.handleChangePostType}
            >
              <MenuItem value="question" primaryText="Question" />
              <MenuItem value="note" primaryText="Note" />
            </SelectField><br/>
            <SelectField
              floatingLabelText="Visibility"
              value={this.state.createPostForm.visibility}
              onChange={this.handleChangeVisibility}
            >
              <MenuItem value="public" primaryText="Public" />
              <MenuItem value="private" primaryText="Private" />
            </SelectField>
          </CardTitle>
        </Card>
        <RaisedButton label="Create" primary={true} onClick={this.handleCreatePost} style={styles.createPostButton}/>
        <RaisedButton label="Cancel" onClick={this.handleCancel} style={styles.createPostButton} />
      </div>
    )

    var editBox = (
      <div>
        <Card style={styles.createBox}>
          <CardHeader
            title={this.state.username}
            avatar={ava}
            actAsExpander={false}
            showExpandableButton={false}
          />
          <CardTitle expandable={false}>
            <TextField
              hintText="Type your question summary here"
              floatingLabelText="Summary"
              rows={1}
              fullWidth={true}
              value={this.state.createPostForm.header}
              onChange={this.handleChangeHeader}
            />
            <TextField
              hintText="Type your question details here"
              floatingLabelText="Description"
              multiLine={true}
              rows={3}
              fullWidth={true}
              value={this.state.createPostForm.description}
              onChange={this.handleChangeDescription}
            />
            <SelectField
              floatingLabelText="Post Type"
              value={this.state.createPostForm.postType}
              onChange={this.handleChangePostType}
              disabled={true}
            >
              <MenuItem value="question" primaryText="Question" />
              <MenuItem value="note" primaryText="Note" />
            </SelectField><br/>
            <SelectField
              floatingLabelText="Visibility"
              value={this.state.createPostForm.visibility}
              onChange={this.handleChangeVisibility}
            >
              <MenuItem value="public" primaryText="Public" />
              <MenuItem value="private" primaryText="Private" />
            </SelectField>
          </CardTitle>
        </Card>
        <RaisedButton label="Submit" primary={true} onClick={this.handleEdit} style={styles.createPostButton}/>
        <RaisedButton label="Cancel" onClick={this.handleCancel} style={styles.createPostButton} />
      </div>
    )

    const deleteActions = [<FlatButton label="Yes" primary={true} keyboardFocused={true} onClick={this.handleDelete} />,
    <FlatButton label="Cancel" primary={true} onClick={this.handleCancel} />];

    const actionRow = (
      <div>
        <RaisedButton label="Create post" primary={true} onClick={this.handleCreatePost} style={styles.createPostButton}/>
        <SelectField
          value={this.state.sort}
          onChange={this.handleSort}
          floatingLabelText="Sort By"
          style={styles.sortDropdown}
        >
          <MenuItem value="time" primaryText="Time" />
          <MenuItem value="vote" primaryText="Votes" />
        </SelectField>
      </div>
    )

    var postContainer = (
      <div style={styles.postBoard}>
        {this.state.showEditBox ? <h1>Edit post</h1> : actionRow}
        {this.state.showEditBox ? editBox : posts}
      </div>
    )
    return (
      <div>
        <AppBar
          title={customTitle}
          iconElementRight={<RaisedButton label={localStorage.getItem('jwtToken') != null ? "Logout" : "Login"} onClick={this.handleLogout} style={styles.rightButton}/>}
          style={styles.appbar}
        />
        <div style={styles.tagPanel}>
          {tagButtons}
        </div>
        {this.state.showCreateBox ? createBox : postContainer}
        <Dialog
          actions={deleteActions}
          modal={false}
          open={this.state.openDeleteDialog}
          onRequestClose={this.handleCancel}
        >
          Are you sure you want to delete this post?
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
    marginRight: '12px'
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
  },
  createBox: {
    marginTop: '12px'
  },
  chip: {
    marginRight: '8px',
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: '20px',
    marginBottom: '-12px'
  },
  privateCard: {
    background: '#f2f2f2'
  }
}
