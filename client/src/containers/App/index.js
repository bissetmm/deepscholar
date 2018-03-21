import React, {Component} from 'react';
import _ from 'lodash';
import {
  HashRouter, Switch, Route, Link
} from 'react-router-dom';
import {connect} from 'react-redux';
import Index from '../Index/index.js';
import Search from '../Search/index.js';
import Detail from '../Detail/index.js';
import {ScrollToTop} from '../../components/index.js';
import {
  changeQuery,
  deleteAllScrollY,
  signedIn,
  signedOut,
  getLabelList,
  updateLabelList,
  favoriteKey
} from '../../module';
import './materializeTheme.css';
import './style.css';
import Api from '../../api';

function mapStateToProps(state) {
  return {state};
}

const NavBar = connect(mapStateToProps)(class NavBar extends Component {
  static TOKEN_STORE_KEY = "token";

  constructor(props) {
    super(props);
    this.searchTimer = null;
    this.query = null;
  }

  componentDidMount() {

    window.addEventListener("message", (event) => {
      if (event.origin !== window.location.origin || event.data.type !== "authenticated") {
        return;
      }

      const user = event.data.user;
      this.signIn(user);
      this.props.dispatch(getLabelList());
    });

    const token = window.localStorage.getItem(NavBar.TOKEN_STORE_KEY);
    if (token) {
      Api.verify(token)
        .then(user => {
          this.signIn(user);
        })
        .catch(() => {
          window.localStorage.removeItem(NavBar.TOKEN_STORE_KEY);
          this.props.dispatch(signedOut());
        });
    }

    this.props.dispatch(getLabelList());

    this.query = this.props.state.query;
  }

  signIn(user) {
    window.localStorage.setItem(NavBar.TOKEN_STORE_KEY, user.token);
    this.props.dispatch(signedIn(user));
  }

  componentDidUpdate(prevProps) {

    const {category: oldCategory, query: oldQuery, author: oldAuthor, abstract: oldAbstract, gte: oldGte, lte: oldLte, booktitles: oldBooktitles, page: oldPage, labelFilter: oldlabelFilter} = prevProps.state;
    const {category: newCategory, query: newQuery, author: newAuthor, abstract: newAbstract, gte: newGte, lte: newLte, booktitles: newBooktitles, page: newPage, labelFilter: newlabelFilter} = this.props.state;

    if (oldCategory === newCategory && oldQuery === newQuery && oldAuthor === newAuthor && oldAbstract === newAbstract && oldPage === newPage && oldGte === newGte && oldLte === newLte && Array.from(oldBooktitles)
        .join("") === Array.from(newBooktitles)
        .join("") && oldlabelFilter === newlabelFilter) {
      return;
    }

    const queries = [];
    if (newQuery !== null) {
      queries.push([
        "q",
        newQuery
      ]);
    }
    if (newAuthor !== null) {
      queries.push([
        "author",
        newAuthor
      ]);
    }
    if (newAbstract !== null) {
      queries.push([
        "abstract",
        newAbstract
      ]);
    }
    if (newPage !== null) {
      queries.push([
        "page",
        newPage + 1
      ]);
    }
    if (newGte !== null) {
      queries.push([
        "gte",
        newGte
      ]);
    }
    if (newLte !== null) {
      queries.push([
        "lte",
        newLte
      ]);
    }
    newBooktitles.forEach(booktitle => {
      queries.push([
        "booktitle[]",
        booktitle
      ]);
    });

    const queryString = queries.map(query => {
      return `${query[0]}=${query[1]}`;
    })
      .join("&");

    const newUrl = `/${newCategory}?${queryString}`;
    const oldUrl = this.props.location.pathname + this.props.location.search;

    if (newUrl !== oldUrl) {
      this.props.history.push(newUrl);
    }

    this.query = newQuery;

    this.refs.search.value = this.props.state.query !== null ? decodeURIComponent(this.props.state.query) : '';

  }

  handleSubmit(e) {
    e.preventDefault();

    if (this.searchTimer !== null) {
      clearTimeout(this.searchTimer);
      this.searchTimer = null;
    }

    this.searchTimer = setTimeout(() => {
      this.props.dispatch(deleteAllScrollY());

      const labelFilter = this.props.state.labelFilter.slice();
      _.remove(labelFilter, n => {
        return n === favoriteKey;
      });

      this.props.dispatch(changeQuery(this.props.state.category, this.query, null, null, null, labelFilter));
    }, 0);
  }

  handleChange(e) {
    this.query = e.target.value;
  }

  handleClickSignIn(e) {
    e.preventDefault();
    window.open('/api/auth/github');
  }

  handleClickSignOut(e) {
    e.preventDefault();

    const {labelList} = this.props.state;
    this.props.dispatch(updateLabelList(labelList));

    window.localStorage.removeItem(NavBar.TOKEN_STORE_KEY);
    this.props.dispatch(signedOut());
  }

  render() {
    const {user} = this.props.state;
    const isSignedIn = user !== null;

    const src = user ? user.profile.photos[0].value : null;

    return (
      <div className="navbar-fixed">
        <nav className="header-navi z-depth-0">
          <div className="nav-wrapper">
            <div className="row">
              <div className="col s4 l3">
                <Link to="/" className="brand-logo"><img src="/images/deepscholar_logo.svg"/></Link>
              </div>
              <div className="col s7 l6">
                <div className="input-field input-field--search">
                  <form onSubmit={this.handleSubmit.bind(this)}>
                    <input type="search" placeholder="Search" ref="search" onChange={this.handleChange.bind(this)}
                           defaultValue={this.props.state.query}/>
                  </form>
                  <label className="label-icon" htmlFor="search"><i className="material-icons">search</i>
                  </label>
                </div>
              </div>
              <ul className="right">
                {!isSignedIn &&
                <li><a href="#" onClick={this.handleClickSignIn.bind(this)}>Sign in</a></li>
                }
                {isSignedIn &&
                <li><a href="#" className="tooltipped" data-position="bottom" data-delay="50"
                       data-tooltip={user.profile.username} onClick={this.handleClickSignOut.bind(this)}><img
                  className="avatar" src={src}/>Sign out</a></li>
                }
              </ul>
            </div>
          </div>
        </nav>
      </div>
    );
  }
});

class App extends Component {
  render() {
    return (
      <HashRouter>
        <div>
          <Route component={props =>
            <NavBar {...props}/>
          }/>
          <div className="container">
            <div>
              <Switch>
                <Route exact path="/papers/:paperId" component={Detail}/>
                <Route exact path="/" component={props =>
                  <Index {...props}/>
                }/>
                <Route component={props =>
                  <ScrollToTop {...props}>
                    <Search {...props}/>
                  </ScrollToTop>
                }/>
              </Switch>
            </div>
          </div>
        </div>
      </HashRouter>
    );
  }
}

export default App;
