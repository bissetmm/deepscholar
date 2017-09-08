import React, {Component} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import Slider from 'rc-slider';
import {Documents} from '../../components/index';
import Api from '../../api';
import {
  changePage, requestDocuments, receiveDocuments, deleteScrollY, changeYears,
  requestAggregations, receiveAggregations
} from '../../module';
import './style.css';
import 'rc-slider/assets/index.css';

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
    this.props.history.push(`/?q=${this.props.state.query}&page=${page + 1}`);
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
    this.searchAggregations();
    this.search();
  }

  componentDidUpdate(prevProps) {
    const {query: oldQuery, gte: oldGte, lte: oldLte, page: oldPage} = prevProps.state;
    const {query: newQuery, gte: newGte, lte: newLte, page: newPage} = this.props.state;
    if (oldQuery !== newQuery || oldPage !== newPage || oldGte !== newGte || oldLte !== newLte) {
      this.search();
    }

    const locationKey = this.props.location.key;
    if (!this.props.state.scrollYPositions.has(locationKey)) {
      return;
    }
    const scrollY = this.props.state.scrollYPositions.get(locationKey);
    this.props.dispatch(deleteScrollY(locationKey));

    window.scrollTo(0, scrollY);
  }

  search() {
    const {query, page, gte, lte} = this.props.state;
    if (!query) {
      return;
    }
    this.props.dispatch(requestDocuments(query, page));
    const from = page * this.props.state.documentsFetchSize;
    const esQuery = {
      bool: {
        must: {
          multi_match: {
            query,
            fields: [
              "id",
              "title",
              "booktitle",
              "abstract",
              "url",
              "author"
            ]
          }
        },
        filter: {
          range: {
            year: {
              gte,
              lte
            }
          }
        }
      }
    };
    const body = JSON.stringify({
      query: esQuery,
      from,
      size: this.props.state.documentsFetchSize
    });
    Api.search({body}).then((json) => {
      this.props.dispatch(receiveDocuments(json));
    });
  }

  searchAggregations() {
    this.props.dispatch(requestAggregations());
    const body = JSON.stringify({
      size: 0,
      aggs: {
        year: {
          histogram: {field: "year", interval: 1}
        }
      }
    });
    Api.search({body}).then((json) => {
      this.props.dispatch(receiveAggregations(json));
    });
  }

  handleAfterChange(range) {
    this.props.dispatch(changeYears(range[0], range[1]));
  }

  render() {
    const Range = Slider.createSliderWithTooltip(Slider.Range);
    const {documents, documentsTotal, aggregations} = this.props.state;

    let year;
    if (aggregations.year.buckets.length > 1) {
      const {gte, lte} = this.props.state;
      const min = aggregations.year.buckets[0].key;
      const max = aggregations.year.buckets[aggregations.year.buckets.length - 1].key;
      year = <Range min={min} max={max} defaultValue={[gte || min, lte || max]}
                    onAfterChange={this.handleAfterChange.bind(this)}/>
    }

    return (
      <div className="row">
        <div className="col s4 l3">
          <p>Publication Yearo</p>
          <div className="publication-year">
            {year}
          </div>

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
