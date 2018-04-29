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
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import Edit from 'material-ui/svg-icons/image/edit';
import Delete from 'material-ui/svg-icons/action/delete';

var _ = require('lodash');
export default class Mainpage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: "All",
      sort: null,
      posts: null,
      showAddBox: false,
      showCreateBox: false,
      openDeleteDialog: false,
      createPostForm: {
        header: "",
        description: "",
        visibility: "public",
        postType: "question"
      },
      actionPid: 0
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
    this.handleCloseDeleteDialog = this.handleCloseDeleteDialog.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }
  componentDidMount() {
    this.fetchPosts();
  }
  fetchPosts() {
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
          author: localStorage.getItem('username'),
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
  handleCloseDeleteDialog() {
    this.setState({openDeleteDialog: false});
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
            <CardTitle expandable={false}>
              {value.description}
            </CardTitle>
            {value.author == localStorage.getItem('username') ?
              (<CardActions>
                <RaisedButton label="more" primary={true} onClick={this.handleOpenDetailPage.bind(this, value.pid)} style={styles.rightButton}/>
                <IconButton tooltip="edit">
                  <Edit />
                </IconButton>
                <IconButton tooltip="delete">
                  <Delete onClick={this.handleOpenDeleteDialog.bind(this, value.pid)}/>
                </IconButton>
              </CardActions>) :
              (<CardActions>
                <RaisedButton label="more" primary={true} onClick={this.handleOpenDetailPage.bind(this, value.pid)} style={styles.rightButton}/>
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
    var tagButtons = tags.map((tag)=>(<RaisedButton label={tag} primary={true} onClick={this.handleFilter.bind(this, tag)} style={styles.tagButton} />));
    tagButtons.unshift(<RaisedButton label="All" primary={true} onClick={this.handleFilter.bind(this, "All")} style={styles.tagButton} />)

    const customTitle = (
      <div>
        <a onClick={(e) => {this.props.history.push('/MainPage')}} style={styles.title}>Zocalo</a>
        <div style={styles.testSearchBar}>
          <SearchBar />
        </div>
      </div>);
    var ava = <Avatar>{localStorage.getItem('username')[0]}</Avatar>
    var createBox = (
      <div style={styles.postBoard}>
        <Card style={styles.createBox}>
          <CardHeader
            title={localStorage.getItem('username')}
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
              rows={1}
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

    const deleteActions = [<FlatButton label="Yes" primary={true} keyboardFocused={true} onClick={this.handleDelete} />,
    <FlatButton label="Cancel" primary={true} onClick={this.handleCloseDeleteDialog} />];

    var postContainer = (
      <div style={styles.postBoard}>
        <RaisedButton label="Create post" primary={true} onClick={this.handleCreatePost} style={styles.createPostButton}/>
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
    )
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
        {this.state.showCreateBox ? createBox : postContainer}
        <Dialog
          actions={deleteActions}
          modal={false}
          open={this.state.openDeleteDialog}
          onRequestClose={this.handleCloseDeleteDialog}
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
  }
}


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
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import Edit from 'material-ui/svg-icons/image/edit';
import Delete from 'material-ui/svg-icons/action/delete';

var _ = require('lodash');
export default class Mainpage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: "All",
      sort: null,
      posts: null,
      showAddBox: false,
      showCreateBox: false,
      openDeleteDialog: false,
      createPostForm: {
        header: "",
        description: "",
        visibility: "public",
        postType: "question"
      },
      actionPid: 0
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
    this.handleCloseDeleteDialog = this.handleCloseDeleteDialog.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }
  componentDidMount() {
    this.fetchPosts();
  }
  fetchPosts() {
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
          author: localStorage.getItem('username'),
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
  handleCloseDeleteDialog() {
    this.setState({openDeleteDialog: false});
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
            <CardTitle expandable={false}>
              {value.description}
            </CardTitle>
            {value.author == localStorage.getItem('username') ?
              (<CardActions>
                <RaisedButton label="more" primary={true} onClick={this.handleOpenDetailPage.bind(this, value.pid)} style={styles.rightButton}/>
                <IconButton tooltip="edit">
                  <Edit />
                </IconButton>
                <IconButton tooltip="delete">
                  <Delete onClick={this.handleOpenDeleteDialog.bind(this, value.pid)}/>
                </IconButton>
              </CardActions>) :
              (<CardActions>
                <RaisedButton label="more" primary={true} onClick={this.handleOpenDetailPage.bind(this, value.pid)} style={styles.rightButton}/>
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
    var tagButtons = tags.map((tag)=>(<RaisedButton label={tag} primary={true} onClick={this.handleFilter.bind(this, tag)} style={styles.tagButton} />));
    tagButtons.unshift(<RaisedButton label="All" primary={true} onClick={this.handleFilter.bind(this, "All")} style={styles.tagButton} />)

    const customTitle = (
      <div>
        <a onClick={(e) => {this.props.history.push('/MainPage')}} style={styles.title}>Zocalo</a>
        <div style={styles.testSearchBar}>
          <SearchBar />
        </div>
      </div>);
    var ava = <Avatar>{localStorage.getItem('username')[0]}</Avatar>
    var createBox = (
      <div style={styles.postBoard}>
        <Card style={styles.createBox}>
          <CardHeader
            title={localStorage.getItem('username')}
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
              rows={1}
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

    const deleteActions = [<FlatButton label="Yes" primary={true} keyboardFocused={true} onClick={this.handleDelete} />,
    <FlatButton label="Cancel" primary={true} onClick={this.handleCloseDeleteDialog} />];

    var postContainer = (
      <div style={styles.postBoard}>
        <RaisedButton label="Create post" primary={true} onClick={this.handleCreatePost} style={styles.createPostButton}/>
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
    )
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
        {this.state.showCreateBox ? createBox : postContainer}
        <Dialog
          actions={deleteActions}
          modal={false}
          open={this.state.openDeleteDialog}
          onRequestClose={this.handleCloseDeleteDialog}
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
  }
}


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
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import Edit from 'material-ui/svg-icons/image/edit';
import Delete from 'material-ui/svg-icons/action/delete';

var _ = require('lodash');
export default class Mainpage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: "All",
      sort: null,
      posts: null,
      showAddBox: false,
      showCreateBox: false,
      openDeleteDialog: false,
      createPostForm: {
        header: "",
        description: "",
        visibility: "public",
        postType: "question"
      },
      actionPid: 0
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
    this.handleCloseDeleteDialog = this.handleCloseDeleteDialog.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }
  componentDidMount() {
    this.fetchPosts();
  }
  fetchPosts() {
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
          author: localStorage.getItem('username'),
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
  handleCloseDeleteDialog() {
    this.setState({openDeleteDialog: false});
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
            <CardTitle expandable={false}>
              {value.description}
            </CardTitle>
            {value.author == localStorage.getItem('username') ?
              (<CardActions>
                <RaisedButton label="more" primary={true} onClick={this.handleOpenDetailPage.bind(this, value.pid)} style={styles.rightButton}/>
                <IconButton tooltip="edit">
                  <Edit />
                </IconButton>
                <IconButton tooltip="delete">
                  <Delete onClick={this.handleOpenDeleteDialog.bind(this, value.pid)}/>
                </IconButton>
              </CardActions>) :
              (<CardActions>
                <RaisedButton label="more" primary={true} onClick={this.handleOpenDetailPage.bind(this, value.pid)} style={styles.rightButton}/>
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
    var tagButtons = tags.map((tag)=>(<RaisedButton label={tag} primary={true} onClick={this.handleFilter.bind(this, tag)} style={styles.tagButton} />));
    tagButtons.unshift(<RaisedButton label="All" primary={true} onClick={this.handleFilter.bind(this, "All")} style={styles.tagButton} />)

    const customTitle = (
      <div>
        <a onClick={(e) => {this.props.history.push('/MainPage')}} style={styles.title}>Zocalo</a>
        <div style={styles.testSearchBar}>
          <SearchBar />
        </div>
      </div>);
    var ava = <Avatar>{localStorage.getItem('username')[0]}</Avatar>
    var createBox = (
      <div style={styles.postBoard}>
        <Card style={styles.createBox}>
          <CardHeader
            title={localStorage.getItem('username')}
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
              rows={1}
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

    const deleteActions = [<FlatButton label="Yes" primary={true} keyboardFocused={true} onClick={this.handleDelete} />,
    <FlatButton label="Cancel" primary={true} onClick={this.handleCloseDeleteDialog} />];

    var postContainer = (
      <div style={styles.postBoard}>
        <RaisedButton label="Create post" primary={true} onClick={this.handleCreatePost} style={styles.createPostButton}/>
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
    )
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
        {this.state.showCreateBox ? createBox : postContainer}
        <Dialog
          actions={deleteActions}
          modal={false}
          open={this.state.openDeleteDialog}
          onRequestClose={this.handleCloseDeleteDialog}
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
  }
}


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
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import Edit from 'material-ui/svg-icons/image/edit';
import Delete from 'material-ui/svg-icons/action/delete';

var _ = require('lodash');
export default class Mainpage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: "All",
      sort: null,
      posts: null,
      showAddBox: false,
      showCreateBox: false,
      openDeleteDialog: false,
      createPostForm: {
        header: "",
        description: "",
        visibility: "public",
        postType: "question"
      },
      actionPid: 0
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
    this.handleCloseDeleteDialog = this.handleCloseDeleteDialog.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }
  componentDidMount() {
    this.fetchPosts();
  }
  fetchPosts() {
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
          author: localStorage.getItem('username'),
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
  handleCloseDeleteDialog() {
    this.setState({openDeleteDialog: false});
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
            <CardTitle expandable={false}>
              {value.description}
            </CardTitle>
            {value.author == localStorage.getItem('username') ?
              (<CardActions>
                <RaisedButton label="more" primary={true} onClick={this.handleOpenDetailPage.bind(this, value.pid)} style={styles.rightButton}/>
                <IconButton tooltip="edit">
                  <Edit />
                </IconButton>
                <IconButton tooltip="delete">
                  <Delete onClick={this.handleOpenDeleteDialog.bind(this, value.pid)}/>
                </IconButton>
              </CardActions>) :
              (<CardActions>
                <RaisedButton label="more" primary={true} onClick={this.handleOpenDetailPage.bind(this, value.pid)} style={styles.rightButton}/>
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
    var tagButtons = tags.map((tag)=>(<RaisedButton label={tag} primary={true} onClick={this.handleFilter.bind(this, tag)} style={styles.tagButton} />));
    tagButtons.unshift(<RaisedButton label="All" primary={true} onClick={this.handleFilter.bind(this, "All")} style={styles.tagButton} />)

    const customTitle = (
      <div>
        <a onClick={(e) => {this.props.history.push('/MainPage')}} style={styles.title}>Zocalo</a>
        <div style={styles.testSearchBar}>
          <SearchBar />
        </div>
      </div>);
    var ava = <Avatar>{localStorage.getItem('username')[0]}</Avatar>
    var createBox = (
      <div style={styles.postBoard}>
        <Card style={styles.createBox}>
          <CardHeader
            title={localStorage.getItem('username')}
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
              rows={1}
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

    const deleteActions = [<FlatButton label="Yes" primary={true} keyboardFocused={true} onClick={this.handleDelete} />,
    <FlatButton label="Cancel" primary={true} onClick={this.handleCloseDeleteDialog} />];

    var postContainer = (
      <div style={styles.postBoard}>
        <RaisedButton label="Create post" primary={true} onClick={this.handleCreatePost} style={styles.createPostButton}/>
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
    )
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
        {this.state.showCreateBox ? createBox : postContainer}
        <Dialog
          actions={deleteActions}
          modal={false}
          open={this.state.openDeleteDialog}
          onRequestClose={this.handleCloseDeleteDialog}
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
  }
}


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
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import Edit from 'material-ui/svg-icons/image/edit';
import Delete from 'material-ui/svg-icons/action/delete';

var _ = require('lodash');
export default class Mainpage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: "All",
      sort: null,
      posts: null,
      showAddBox: false,
      showCreateBox: false,
      openDeleteDialog: false,
      createPostForm: {
        header: "",
        description: "",
        visibility: "public",
        postType: "question"
      },
      actionPid: 0
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
    this.handleCloseDeleteDialog = this.handleCloseDeleteDialog.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }
  componentDidMount() {
    this.fetchPosts();
  }
  fetchPosts() {
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
          author: localStorage.getItem('username'),
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
  handleCloseDeleteDialog() {
    this.setState({openDeleteDialog: false});
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
            <CardTitle expandable={false}>
              {value.description}
            </CardTitle>
            {value.author == localStorage.getItem('username') ?
              (<CardActions>
                <RaisedButton label="more" primary={true} onClick={this.handleOpenDetailPage.bind(this, value.pid)} style={styles.rightButton}/>
                <IconButton tooltip="edit">
                  <Edit />
                </IconButton>
                <IconButton tooltip="delete">
                  <Delete onClick={this.handleOpenDeleteDialog.bind(this, value.pid)}/>
                </IconButton>
              </CardActions>) :
              (<CardActions>
                <RaisedButton label="more" primary={true} onClick={this.handleOpenDetailPage.bind(this, value.pid)} style={styles.rightButton}/>
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
    var tagButtons = tags.map((tag)=>(<RaisedButton label={tag} primary={true} onClick={this.handleFilter.bind(this, tag)} style={styles.tagButton} />));
    tagButtons.unshift(<RaisedButton label="All" primary={true} onClick={this.handleFilter.bind(this, "All")} style={styles.tagButton} />)

    const customTitle = (
      <div>
        <a onClick={(e) => {this.props.history.push('/MainPage')}} style={styles.title}>Zocalo</a>
        <div style={styles.testSearchBar}>
          <SearchBar />
        </div>
      </div>);
    var ava = <Avatar>{localStorage.getItem('username')[0]}</Avatar>
    var createBox = (
      <div style={styles.postBoard}>
        <Card style={styles.createBox}>
          <CardHeader
            title={localStorage.getItem('username')}
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
              rows={1}
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

    const deleteActions = [<FlatButton label="Yes" primary={true} keyboardFocused={true} onClick={this.handleDelete} />,
    <FlatButton label="Cancel" primary={true} onClick={this.handleCloseDeleteDialog} />];

    var postContainer = (
      <div style={styles.postBoard}>
        <RaisedButton label="Create post" primary={true} onClick={this.handleCreatePost} style={styles.createPostButton}/>
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
    )
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
        {this.state.showCreateBox ? createBox : postContainer}
        <Dialog
          actions={deleteActions}
          modal={false}
          open={this.state.openDeleteDialog}
          onRequestClose={this.handleCloseDeleteDialog}
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
  }
}
