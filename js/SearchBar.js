import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ActionSearch from 'material-ui/svg-icons/action/search';
import queryString from 'query-string';

export default class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: ''
    }
    this.updateSearch = this.updateSearch.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }
  componentWillMount() {
    const parsed = queryString.parse(location.search);
    if (parsed.search) {
      this.setState({search: parsed.search});
    }
  }
  updateSearch(e) {
    this.setState({search: e.target.value});
  }
  onSearchChange(search) {
    this.setState({search: search});
    this.props.updateSearch(search);
  }
  onSearch() {
    console.log("Searching " + this.state.search);
  }
  handleKeyPress(e) {
    if (e.key === 'Enter') this.onSearch()
  }
  render() {
    return (
      <div style={{float: 'left', position: 'relative'}}>
        <input
          type="text"
          placeholder="Search"
          value={this.state.search}
          ref="name"
          onChange={this.updateSearch}
          onKeyPress={this.handleKeyPress}
          style={styles.searchInput} />
        <ActionSearch onClick={this.onSearch} style={{position: 'absolute', right: '10px', top: '24px', cursor: 'pointer'}} />
      </div>
    );
  }
}

const styles = {
  searchInput: {
    display: 'inline-block',
    fontSize: '14px',
    color:'black',
    border: '1px solid #DDD',
    paddingLeft: '40px',
    paddingRight:'12px',
    height: '36px',
    width: '300px',
    borderRadius: '36px',
    outline: '0px',
    boxShadow: 'none'
  }
}
