import React, {Component} from 'react';
import {
  HashRouter, Switch, Route, Link
} from 'react-router-dom';
import {connect} from 'react-redux';
import Index from '../Index/index.js';
import Search from '../Search/index.js';
import Detail from '../Detail/index.js';
import {ScrollToTop} from '../../components/index.js';
import {changeQuery, deleteAllScrollY} from '../../module';
import './materializeTheme.css';
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
    const {category: oldCategory, query: oldQuery, articleTitle: oldArticleTitle, author: oldAuthor, abstract: oldAbstract, gte: oldGte, lte: oldLte, booktitles: oldBooktitles, page: oldPage} = prevProps.state;
    const {category: newCategory, query: newQuery, articleTitle: newArticleTitle, author: newAuthor, abstract: newAbstract, gte: newGte, lte: newLte, booktitles: newBooktitles, page: newPage} = this.props.state;
    if (oldCategory === newCategory && oldQuery === newQuery && oldArticleTitle === newArticleTitle && oldAuthor === newAuthor && oldAbstract === newAbstract && oldPage === newPage && oldGte === newGte && oldLte === newLte && Array.from(oldBooktitles).join("") === Array.from(newBooktitles).join("")) {
      return;
    }

    const queries = [];
    if (newQuery !== null) {
      queries.push(["q", newQuery]);
    }
    if (newArticleTitle !== null) {
      queries.push(["articleTitle", newArticleTitle]);
    }
    if (newAuthor !== null) {
      queries.push(["author", newAuthor]);
    }
    if (newAbstract !== null) {
      queries.push(["abstract", newAbstract]);
    }
    if (newPage !== null) {
      queries.push(["page", newPage + 1]);
    }
    if (newGte !== null) {
      queries.push(["gte", newGte]);
    }
    if (newLte !== null) {
      queries.push(["lte", newLte]);
    }
    newBooktitles.forEach(booktitle => {
      queries.push(["booktitle[]", booktitle]);
    });

    const queryString = queries.map(query => {
      return `${query[0]}=${query[1]}`;
    }).join("&");
    const url = `/${newCategory}?${queryString}`;

    this.props.history.push(url);
    if( this.props.state.query != null ){
      this.refs.search.value = decodeURIComponent(this.props.state.query);
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    if (this.searchTimer !== null) {
      clearTimeout(this.searchTimer);
      this.searchTimer = null;
    }

    this.searchTimer = setTimeout(() => {
      this.props.dispatch(deleteAllScrollY());
      this.props.dispatch(changeQuery(this.props.state.category, this.query));
    }, 0);
  }

  handleChange(e) {
    this.query = e.target.value;
  }

  render() {
    return (
      <div className="nav-wrapper">
        <div className="row">
          <div className="col s4 l3">
            <Link to="/" className="brand-logo"><img src="/images/deepscholar_logo.svg"/></Link>
          </div>
          <div className="col s8 l7">
            <div className="input-field input-field--search">
              <form onSubmit={this.handleSubmit.bind(this)}>
                <input type="search" placeholder="Search" ref="search" onChange={this.handleChange.bind(this)}
                       defaultValue={this.props.state.query}/>
              </form>
              <label className="label-icon" htmlFor="search"><i className="material-icons">search</i>
              </label>
            </div>
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
      <HashRouter>
        <div>
          <div className="navbar-fixed">
            <nav className="header-navi z-depth-0">
              <Route component={(props) => (
                <NavBar {...props}/>
              )}/>
            </nav>
          </div>
          <div className="container">
            <div>
              <Switch>
                <Route exact path="/papers/:paperId" component={Detail}/>
                <Route exact path="/" component={(props) => (
                  <Index {...props}/>
                )}/>
                <Route component={(props) => (
                  <ScrollToTop {...props}>
                    <Search {...props}/>
                  </ScrollToTop>
                )}/>
              </Switch>
            </div>
          </div>
        </div>
      </HashRouter>
    );
  }
}

export default App;
