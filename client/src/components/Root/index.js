import React, {Component} from 'react';
import {
  BrowserRouter as Router, Switch, Route, Link
} from 'react-router-dom';
import App from '../App';
import Detail from '../Detail';
import {ScrollToTop} from '../common';
import './style.css';
import queryString from 'query-string';

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.searchTimer = null;
    this.query = null;
  }

  handleSubmit(e) {
    e.preventDefault();

    if (this.searchTimer !== null) {
      clearTimeout(this.searchTimer);
      this.searchTimer = null;
    }
    const query = this.query;

    if (!query) {
      return;
    }

    this.searchTimer = setTimeout(() => {
      this.props.history.push(`/?q=${query}`);
      this.props.performSearch(query);
    }, 0);
  }

  handleChange(e) {
    this.query = e.target.value;
  }

  render() {
    return (
      <div className="nav-wrapper">
        <div className="row">
          <div className="col s4 l3 hide-on-med-and-down">
            <Link to="/" className="brand-logo"><i className="material-icons">cloud</i>DeepScholar</Link>
          </div>
          <div className="col s9 l7">
            <div className="input-field">
              <form onSubmit={this.handleSubmit.bind(this)}>
                <input type="search" placeholder="Word Representations" onChange={this.handleChange.bind(this)}
                       defaultValue={this.props.query}/>
              </form>
              <label className="label-icon" htmlFor="search"><i className="material-icons">search</i>
              </label>
              <i className="material-icons closed">close</i>
            </div>
          </div>
          <div className="col s3 l2 right">
            <ul className="right">
              <li><a href="#"><i className="material-icons">view_module</i></a></li>
              <li><a href="#"><i className="material-icons">refresh</i></a></li>
              <li><a href="#"><i className="material-icons">more_vert</i></a></li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

class Root extends Component {
  constructor(props) {
    super(props);
    const parsed = queryString.parse(window.location.search);
    this.state = {query: parsed.q, page: (parsed.page || 1) - 1};
  }

  performSearch(query) {
    this.setState({query: query, page: this.state.page});
  }

  render() {
    return (
      <Router>
        <div>
          <div className="navbar-fixed">
            <nav className="navy">
              <Route component={(props) => (
                <NavBar {...props} performSearch={this.performSearch.bind(this)} query={this.state.query}/>
              )}/>
            </nav>
          </div>
          <div className="container">
            <div>
              <Switch>
                <Route exact path="/" component={(props) => (
                  <ScrollToTop {...props} >
                    <App {...props} query={this.state.query} page={this.state.page}/>
                  </ScrollToTop>
                )}/>
                <Route exact path="/documents/:documentId" component={Detail}/>
              </Switch>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

export default Root;
