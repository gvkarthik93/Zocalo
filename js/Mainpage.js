import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import {Grid, Row, Col} from 'react-flexbox-grid/lib/index';
var _ = require('lodash');
export default class Mainpage extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    // this.handleChangeUsername = this.handleChangeUsername.bind(this);
    // this.handleChangePassword = this.handleChangePassword.bind(this);
    // this.handleChangeRetypePass = this.handleChangeRetypePass.bind(this);
    // this.handleChangeEmail = this.handleChangeEmail.bind(this);
    // this.handleChangeFullName = this.handleChangeFullName.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
  }
  getTempData() {
    var data = {"ID1":{"Post": "Is there an exam tomorrow?" ,"Desc": "I am having a conflict. Do we have an exam tomorrow?", "TAG": "Exam", "VOTE": 10, "Time":"03-08-2018", "Author": "Alice"},
  	"ID2":{"Post": "What's SQLITE?" ,"Desc": "What's the best resource?", "TAG": "Project 1", "VOTE": 10, "Time":"03-06-2018", "Author": "Sihan"},
  	"ID3":{"Post": "Can we use Sqlite?" ,"Desc": "Wondering if we can use it or not", "TAG": "Project 1", "VOTE": 10, "Time":"03-05-2018", "Author": "Karthik"},
  	"ID4":{"Post": "What's difference betwen MongoDb and Sqlite?" ,"Desc": "Both seems cool.", "TAG": "Project 1", "VOTE": 10, "Time":"03-04-2018", "Author": "Miles"},
  	"ID5":{"Post": "Do we need to finish it before due date?" ,"Desc": "I am lazy.", "TAG": "Just Alice Things", "VOTE": 10, "Time":"03-03-2018", "Author": "Alice"},
  	"ID6":{"Post": "Is it necessary to do epic frontend for project?" ,"Desc": "I am a React fan.", "TAG": "Just Alice Things", "VOTE": 10, "Time":"03-02-2018", "Author": "Alice"},
  	"ID7":{"Post": "Should I join Google or GS?" ,"Desc": "I am confused!!!", "TAG": "Just Alice Things", "VOTE": 10, "Time":"03-01-2018", "Author": "Alice"}}
    return data;
  }
  render() {
    // console.log(this.getTempData());
    var posts = _.map(this.getTempData(), function(value, key) {
      return (
        <div style={styles.cardContainer}>
          <Card>
            <CardHeader
              title={value.Post}
              subtitle={value.Time}
              actAsExpander={true}
              showExpandableButton={true}
            />
            <CardText expandable={true}>
              {value.Desc}
            </CardText>
          </Card>
        </div>
      )
    });
    return (
      <div>
        <AppBar
          title="Zocalo"
        />
        <Drawer open={true}>
          <AppBar title="Zocalo" />
        </Drawer>
        <div style={styles.postBoard}>
          {posts}
        </div>
      </div>
    )
  }
}
const styles = {
  postBoard: {
    padding: '35px 20px 35px 276px'
  },
  cardContainer: {
    padding: '10px 0px'
  }
}
