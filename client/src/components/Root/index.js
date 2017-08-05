import React, {Component} from 'react';
import {
  BrowserRouter as Router, Switch, Route, Link
} from 'react-router-dom';
import App from '../App';
import Detail from '../Detail';
import './style.css';
import queryString from 'query-string';

class Root extends Component {
  constructor(props) {
    super(props);
    this.searchTimer = null;
    const parsed = queryString.parse(window.location.search);
    this.state = {query: parsed.q};
  }

  handleTextChange(e) {
    if (this.searchTimer !== null) {
      clearTimeout(this.searchTimer);
      this.searchTimer = null;
    }
    const query = e.target.value;

    if (!query) {
      return;
    }

    this.searchTimer = setTimeout(() => {
      this.setState({query: query});
    }, 1000);
  }

  render() {
    return (
      <Router>
        <div>
          <div className="navbar-fixed">
            <nav className="navy">
              <div className="nav-wrapper">
                <div className="row">
                  <div className="col s4 l3 hide-on-med-and-down">
                    <Link to="/" className="brand-logo"><i className="material-icons">cloud</i>DeepScholar</Link>
                  </div>
                  <div className="col s9 l7">
                    <div className="input-field">
                      <input type="search" onChange={this.handleTextChange.bind(this)}
                             placeholder="Word Representations"/>
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
            </nav>
          </div>
          <div className="container">
            <div>
              <Switch>
                <Route exact path="/" component={(props) => (
                  <App {...props} query={this.state.query}/>
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
