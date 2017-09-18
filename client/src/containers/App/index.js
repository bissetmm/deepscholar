import React, {Component} from 'react';
import {
  BrowserRouter, Switch, Route, Link
} from 'react-router-dom';
import {connect} from 'react-redux';
import Search from '../Search/index.js';
import Detail from '../Detail/index.js';
import {ScrollToTop} from '../../components/index.js';
import {changeQuery, deleteAllScrollY} from '../../module';
import './style.css';

function mapStateToProps(state) {
  return {state};
}

const NavBar = connect(mapStateToProps)(class NavBar extends Component {
  constructor(props) {
    super(props);
    this.searchTimer = null;
    this.query = null;
  }

  componentDidUpdate(prevProps) {
    const {query: oldQuery, gte: oldGte, lte: oldLte, authors: oldAuthors, booktitles: oldBooktitles, page: oldPage} = prevProps.state;
    const {query: newQuery, gte: newGte, lte: newLte, authors: newAuthors, booktitles: newBooktitles, page: newPage} = this.props.state;
    if (oldQuery === newQuery && oldPage === newPage && oldGte === newGte && oldLte === newLte && Array.from(oldAuthors).join("") === Array.from(newAuthors).join("") && Array.from(oldBooktitles).join("") === Array.from(newBooktitles).join("")) {
      return;
    }


    let url = "/";
    if (newQuery !== null) {
      url += `?q=${newQuery}`;
    }
    if (newPage !== null) {
      url += `&page=${newPage + 1}`;
    }
    if (newGte !== null) {
      url += `&gte=${newGte}`;
    }
    if (newLte !== null) {
      url += `&lte=${newLte}`;
    }
    newAuthors.forEach(author => {
      url += `&author[]=${author}`;
    });
    newBooktitles.forEach(booktitle => {
      url += `&booktitle[]=${booktitle}`;
    });

    this.props.history.push(url);
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
      this.props.dispatch(deleteAllScrollY());
      this.props.dispatch(changeQuery(query));
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
                <input type="search" placeholder="Search" onChange={this.handleChange.bind(this)}
                       defaultValue={this.props.state.query}/>
              </form>
              <label className="label-icon" htmlFor="search"><i className="material-icons">search</i>
              </label>
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
});

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <div className="navbar-fixed">
            <nav className="navy">
              <Route component={(props) => (
                <NavBar {...props}/>
              )}/>
            </nav>
          </div>
          <div className="container">
            <div>
              <Switch>
                <Route exact path="/" component={(props) => (
                  <ScrollToTop {...props}>
                    <Search {...props}/>
                  </ScrollToTop>
                )}/>
                <Route exact path="/documents/:documentId" component={Detail}/>
              </Switch>
            </div>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
