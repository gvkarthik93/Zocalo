import React, { Component } from 'react';
import { Link, Router } from 'react-router-dom';

export default class PostDetailPage extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //
    // };
    // this.handleFilter = this.handleFilter.bind(this);
  }
  render() {
    console.log(this.props.match.params.pid);
    return (
      <div>
        <h1> Hello! </h1>
      </div>
    )
  }
}
