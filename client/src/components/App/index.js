import React, {Component} from 'react';
import _ from 'lodash';
import {Documents} from '../common';
import Api from '../../api';
import './style.css';

class Paginator extends Component {
  handlePageClick(i, e) {
    e.preventDefault();
    this.props.handleChangePage(i);
  }

  handlePrevClick(e) {
    e.preventDefault();
    this.props.handleChangePage(this.props.currentPage - 1);
  }

  handleNextClick(e) {
    e.preventDefault();
    this.props.handleChangePage(this.props.currentPage + 1);
  }

  render() {
    const maxPage = this.props.maxPage;
    if (maxPage === 0) {
      return null;
    }

    const currentPage = this.props.currentPage;
    let start, end;
    if (maxPage - currentPage > 5) {
      start = Math.max(currentPage - 4, 0);
      end = Math.min(start + 10, maxPage);
    } else {
      end = maxPage;
      start = Math.max(maxPage - 10, 0);
    }

    const pages = _.range(start, end).map((i) => {
      const className = i === currentPage ? 'active' : 'waves-effect';

      return <li key={i} className={className}><a href="#" onClick={this.handlePageClick.bind(this, i)}>{i + 1}</a>
      </li>;
    });

    const prevClassName = currentPage === 0 ? 'disabled' : 'waves-effect';
    const nextClassName = currentPage === maxPage ? 'disabled' : 'waves-effect';
    return (
      <ul className="pagination center-align">
        <li className={prevClassName}><a href="#" onClick={this.handlePrevClick.bind(this)}><i
          className="material-icons">chevron_left</i></a></li>
        {pages}
        <li className={nextClassName}><a href="#" onClick={this.handleNextClick.bind(this)}><i
          className="material-icons">chevron_right</i></a></li>
      </ul>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {documents: [], documentsTotal: null, documentPage: 0, documentsFetchSize: 20};
  }

  componentDidMount() {
    this.beginSearch(this.props.query || '*');
  }

  beginSearch(query) {
    if (!query) {
      return;
    }

    this.search(query, 0);
    this.setState({documentPage: 0});
  }

  search(query, page) {
    const from = page * this.state.documentsFetchSize;
    Api.search(`q=${query}&size=${this.state.documentsFetchSize}&from=${from}`)
      .then((json) => {
        this.setState({
          documents: json.hits.hits.map((item) => item._source)
        });
        this.setState({documentsTotal: json.hits.total});
      });
  }

  handleChangePage(page) {
    this.search(this.props.query, page);
    this.setState({documentPage: page});
  }

  render() {
    return (
      <div className="row">
        <div className="col s4 l3">
          <p>Publication Year</p>
          <ul>
            <li>
              <input id="year1" type="checkbox" className="filled-in"/>
              <label className="red-text" htmlFor="year1">2016 (321)</label>
            </li>
            <li>
              <input id="year2" type="checkbox" className="filled-in"/>
              <label className="red-text" htmlFor="year2">2015 (592)</label>
            </li>
            <li>
              <input id="year3" type="checkbox" className="filled-in"/>
              <label className="red-text" htmlFor="year3">2014 (507)</label>
            </li>
          </ul>

          <p>Author</p>
          <ul>
            <li>
              <input id="author1" type="checkbox" className="filled-in"/>
              <label className="red-text" htmlFor="author1">Yoshua Bengio (67)</label>
            </li>
            <li>
              <input id="author2" type="checkbox" className="filled-in"/>
              <label className="red-text" htmlFor="author2">Richard Socher (29)</label>
            </li>
            <li>
              <input id="author3" type="checkbox" className="filled-in"/>
              <label className="red-text" htmlFor="author3">Andrew Y. Ng (18)</label>
            </li>
          </ul>
        </div>
        <div className="col s8 l9">
          {this.state.documentsTotal > 0 &&
          <p>{this.state.documentsTotal} results</p>
          }
          <Documents data={this.state.documents}/>
          <Paginator handleChangePage={this.handleChangePage.bind(this)}
                     maxPage={Math.floor(this.state.documentsTotal / this.state.documentsFetchSize) || 0}
                     currentPage={this.state.documentPage}/>
        </div>
      </div>
    );
  }
}

export default App;
