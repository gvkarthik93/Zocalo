import React, { Component } from 'react';
import { Link, Router } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import Avatar from 'material-ui/Avatar';
import {Card, CardActions, CardHeader, CardTitle, CardText} from 'material-ui/Card';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import Edit from 'material-ui/svg-icons/image/edit';
import Delete from 'material-ui/svg-icons/action/delete';

export default class PostDetailPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postDetails: null,
      showAddBox: false,
      showEditBox: false,
      answer: '',
      openDeleteDialog: false,
      actionRid: 0
    };
    this.handleChangeAnswer = this.handleChangeAnswer.bind(this);
    this.handleAddAnswer = this.handleAddAnswer.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.fetchPostDetail = this.fetchPostDetail.bind(this);
    this.handleOpenDeleteDialog = this.handleOpenDeleteDialog.bind(this);
    this.handleCloseDeleteDialog = this.handleCloseDeleteDialog.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleShowEdit = this.handleShowEdit.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
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
    this.setState({showEditBox: false});
    this.setState({answer: ''});
  }
  handleOpenDeleteDialog(rid, e) {
    this.setState({openDeleteDialog: true});
    this.setState({actionRid: rid});
  }
  handleCloseDeleteDialog() {
    this.setState({openDeleteDialog: false});
  }
  handleShowEdit(rid, answer, e) {
    this.setState({showEditBox: true});
    this.setState({actionRid: rid});
    this.setState({answer: answer});
  }
  handleEdit() {
    fetch('/posts/' + this.props.match.params.pid + '/answer/' + this.state.actionRid, {
      credentials: 'include',
      method: 'PUT',
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
      console.log("Edit post response");
      console.log(data);
      if (data.status == 1) {
        this.setState({showEditBox: false});
        this.setState({answer: ''});
        this.fetchPostDetail();
      }
      else {
        console.log("Something went wrong.")
      }
    }.bind(this))
  }
  handleDelete() {
    ///posts/{id}/answer/{id}
    fetch('/posts/' + this.props.match.params.pid + '/answer/' + this.state.actionRid, {
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
        this.fetchPostDetail();
        this.setState({openDeleteDialog: false});
      }
      else {
        console.log("Something went wrong.")
      }
    }.bind(this))
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
              {value.author == localStorage.getItem('username') ?
                (<CardActions>
                  <IconButton tooltip="edit">
                    <Edit onClick={this.handleShowEdit.bind(this, value.rid, value.answer)}/>
                  </IconButton>
                  <IconButton tooltip="delete">
                    <Delete onClick={this.handleOpenDeleteDialog.bind(this, value.rid)}/>
                  </IconButton>
                </CardActions>) :
                null
              }
            </Card>
          </div>
        )
      }.bind(this));

      var ava = <Avatar>{localStorage.getItem('username')[0]}</Avatar>
      var addBox = (
        <div>
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
          <RaisedButton label="Submit" primary={true} onClick={this.handleAddAnswer} style={styles.addAnsButton} />
          <RaisedButton label="Cancel" onClick={this.handleCancel} style={styles.addAnsButton} />
        </div>
      )
      var editBox = (
        <div>
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
          <RaisedButton label="Submit" primary={true} onClick={this.handleEdit} style={styles.addAnsButton} />
          <RaisedButton label="Cancel" onClick={this.handleCancel} style={styles.addAnsButton} />
        </div>
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
          <h1>{!this.state.showEditBox ? "Answers" : "Edit answer"}</h1>
          {!this.state.showEditBox ? replies : null}
          {this.state.showAddBox || this.state.showEditBox ? null : <RaisedButton label="Add Answer" primary={true} onClick={this.handleAddAnswer} style={styles.addAnsButton} />}
          {this.state.showAddBox ? addBox : null}
          {this.state.showEditBox ? editBox : null}
        </div>)
    }

    const deleteActions = [<FlatButton label="Yes" primary={true} keyboardFocused={true} onClick={this.handleDelete} />,
    <FlatButton label="Cancel" primary={true} onClick={this.handleCloseDeleteDialog} />];

    return (
      <div>
        <AppBar
          title="Zocalo"
          onTitleClick={(e) => {console.log("eh")}}
          iconElementRight={<RaisedButton label="Login" onClick={()=>{this.props.history.push('/Loginpage');}} style={styles.rightButton}/>}
          style={styles.appbar}
        />
        {postContainer}
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
