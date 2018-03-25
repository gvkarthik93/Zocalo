import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Avatar from 'material-ui/Avatar';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import {Grid, Row, Col} from 'react-flexbox-grid/lib/index';
//import 'react-sticky-header/styles.css';
//import StickyHeader from 'react-sticky-header';
import SearchBar from './SearchBar';
var _ = require('lodash');
export default class Mainpage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: "All"
    };
    this.handleFilter = this.handleFilter.bind(this);
    this.getFilteredData = this.getFilteredData.bind(this);
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
    // var data = _.filter(getTempData(), function(o) {
    //   return o.TAG == this.state.filter;
    // });
    return data;
  }
  handleFilter(tag, e) {
    e.preventDefault();
    this.setState({filter: tag});
    console.log(tag);
  }
  render() {
    console.log("Changed");
    // <CardActions>
    //   <RaisedButton label="more" style={styles.rightButton}/>
    // </CardActions>
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
          </Card>
        </div>
      )
    });
    var tags = _.map(this.getTempData(), function(value, key) {
      return value.TAG;
    });
    var tags = _.uniq(tags);
    var tagButtons = tags.map((tag)=>(<RaisedButton label={tag} primary={true} onClick={this.handleFilter.bind(this, tag)} style={styles.tagButton} />));
    tagButtons.unshift(<RaisedButton label="All" primary={true} onClick={this.handleFilter.bind(this, "All")} style={styles.tagButton} />)
    // var tagItems = tags.map((tag)=>(<MenuItem>{tag}</MenuItem>));
    // <Drawer open={true} zDepth={0}>
    //   <AppBar
    //     title="Zocalo"
    //   />
    //   {tagItems}
    // </Drawer>
    const customTitle = (
      <div>
        <h1 style={styles.title}>Zocalo</h1>
        <div style={styles.testSearchBar}>
          <SearchBar />
        </div>
      </div>);
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
