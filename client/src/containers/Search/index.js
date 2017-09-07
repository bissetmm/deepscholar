import React, {Component} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {Documents} from '../../components/index';
import Api from '../../api';
import {changePage, requestDocuments, receiveDocuments, deleteScrollY} from '../../module';

function mapStateToProps(state) {
  return {state};
}

const Paginator = withRouter(connect(mapStateToProps)(class Paginator extends Component {
  handlePageClick(i, e) {
    e.preventDefault();
    this.changePage(i);
  }

  handlePrevClick(e) {
    e.preventDefault();
    this.changePage(this.props.state.page - 1);
  }

  handleNextClick(e) {
    e.preventDefault();
    this.changePage(this.props.state.page + 1);
  }

  changePage(page) {
    this.props.history.push(`/?q=${this.props.state.q}&page=${page + 1}`);
    this.props.dispatch(changePage(page));
  }

  render() {
    const maxPage = Math.floor(this.props.state.documentsTotal / this.props.state.documentsFetchSize) || 0;
    if (maxPage === 0) {
      return null;
    }

    const currentPage = this.props.state.page;
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
}));

class Search extends Component {
  componentDidMount() {
    this.beginSearch();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.state.q !== this.props.state.q || prevProps.state.page !== this.props.state.page) {
      this.beginSearch();
    }

    const locationKey = this.props.location.key;
    if (!this.props.state.scrollYPositions.has(locationKey)) {
      return;
    }
    const scrollY = this.props.state.scrollYPositions.get(locationKey);
    this.props.dispatch(deleteScrollY(locationKey));

    window.scrollTo(0, scrollY);
  }

  beginSearch() {
    this.search();
  }

  search() {
    const {q, page} = this.props.state;
    if (!q) {
      return;
    }
    this.props.dispatch(requestDocuments(q, page));
    const from = page * this.props.state.documentsFetchSize;
    const body = JSON.stringify({
      query: {
        multi_match: {
          query: q,
          fields: ["id", "title", "booktitle", "abstract", "url", "author"]
        }
      },
      from,
      size: this.props.state.documentsFetchSize,
      aggs: {
        year: {
          histogram: {field: "year", interval: 1}
        }
      }
    });
    Api.search({body}).then((json) => {
      this.props.dispatch(receiveDocuments(json));
    });
  }

  render() {
    const {documents, documentsTotal} = this.props.state;
    return (
      <div className="row">
        <div className="col s4 l3">
          <p>Publication Year</p>
          <ul>
            <li>
              <input id="year1" type="checkbox" className="filled-in"/>
              <label htmlFor="year1">2016 (321)</label>
            </li>
            <li>
              <input id="year2" type="checkbox" className="filled-in"/>
              <label htmlFor="year2">2015 (592)</label>
            </li>
            <li>
              <input id="year3" type="checkbox" className="filled-in"/>
              <label htmlFor="year3">2014 (507)</label>
            </li>
          </ul>

          <p>Author</p>
          <ul>
            <li>
              <input id="author1" type="checkbox" className="filled-in"/>
              <label htmlFor="author1">Yoshua Bengio (67)</label>
            </li>
            <li>
              <input id="author2" type="checkbox" className="filled-in"/>
              <label htmlFor="author2">Richard Socher (29)</label>
            </li>
            <li>
              <input id="author3" type="checkbox" className="filled-in"/>
              <label htmlFor="author3">Andrew Y. Ng (18)</label>
            </li>
          </ul>
        </div>
        <div className="col s8 l9">
          {documentsTotal > 0 &&
          <p>{documentsTotal} results</p>
          }
          <Documents data={documents}/>
          <Paginator/>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Search);
