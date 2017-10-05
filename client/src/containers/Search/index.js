import React, {Component} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {RangeSliderHistogram} from 'searchkit';
import Slider from 'rc-slider';
import {Documents} from '../../components/index.js';
import Api from '../../api';
import {
  changePage, requestDocuments, receiveDocuments, deleteScrollY, changeYears,
  changeAuthor, changeBooktitle
} from '../../module';
import './style.css';
import 'searchkit/release/theme.css';
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

const PublicationFilter = connect(mapStateToProps)(class PublicationFilter extends Component {
  componentDidUpdate() {
    this.minValue = this.maxValue = null;
  }

  handleOnChange(range) {
    this.minValue = range.min;
    this.maxValue = range.max;
    this.forceUpdate();
  }

  handleOnFinished(range) {
    this.props.dispatch(changeYears(range.min, range.max));
  }

  render() {
    return <RangeSliderHistogram items={this.props.items}
                                 min={this.props.min}
                                 max={this.props.max}
                                 minValue={this.minValue || this.props.minValue}
                                 maxValue={this.maxValue || this.props.maxValue}
                                 onChange={this.handleOnChange.bind(this)}
                                 onFinished={this.handleOnFinished.bind(this)}/>;
  }
});

class Search extends Component {
  componentDidMount() {
    this.search();
  }

  componentDidUpdate(prevProps) {
    const {query: oldQuery, gte: oldGte, lte: oldLte, authors: oldAuthors, booktitles: oldBooktitles, page: oldPage} = prevProps.state;
    const {query: newQuery, gte: newGte, lte: newLte, authors: newAuthors, booktitles: newBooktitles, page: newPage} = this.props.state;
    if (oldQuery !== newQuery || oldPage !== newPage || oldGte !== newGte || oldLte !== newLte || Array.from(oldAuthors).join("") !== Array.from(newAuthors).join("") || Array.from(oldBooktitles).join("") !== Array.from(newBooktitles).join("")) {
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
    const {query, page, gte, lte, authors, booktitles} = this.props.state;
    if (!query) {
      return;
    }
    this.props.dispatch(requestDocuments(query, page));
    const from = page * this.props.state.documentsFetchSize;

    const must = [];
    must.push({
      range: {
        year: {
          gte,
          lte
        }
      }
    });
    if (authors.size > 0) {
      must.push({
        terms: {
          "author.keyword": Array.from(authors)
        }
      });
    }
    if (booktitles.size > 0) {
      must.push({
        terms: {
          "booktitle.keyword": Array.from(booktitles)
        }
      });
    }

    const body = JSON.stringify({
      query: {
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
          }
        }
      },
      post_filter: {
        bool: {
          must
        }
      },
      from,
      size: this.props.state.documentsFetchSize,
      aggs: {
        year: {
          histogram: {
            field: "year",
            interval: 1
          }
        },
        author: {
          terms: {
            field: "author.keyword",
            size: 10
          }
        },
        booktitle: {
          terms: {
            field: "booktitle.keyword",
            size: 10
          }
        }
      }
    });
    Api.search({body}).then((json) => {
      this.props.dispatch(receiveDocuments(json));
    });
  }

  handleChangeAuthor(key) {
    this.props.dispatch(changeAuthor(key));
  }

  handleChangeBooktitle(key) {
    this.props.dispatch(changeBooktitle(key));
  }

  render() {
    const {documents, documentsTotal, aggregations, authors, booktitles} = this.props.state;

    let year;
    if (aggregations.year.buckets.length > 1) {
      const {gte, lte} = this.props.state;
      const min = aggregations.year.buckets[0].key;
      const max = aggregations.year.buckets[aggregations.year.buckets.length - 1].key;
      year = <PublicationFilter items={aggregations.year.buckets}
                                min={min}
                                max={max}
                                minValue={gte || min}
                                maxValue={lte || max}/>
    }

    let authorComponents;
    if (aggregations.author.buckets.length > 1) {
      authorComponents = aggregations.author.buckets.map((author, index) => {
        const id = `author${index}`;
        return (
          <li key={id}>
            <input id={id} type="checkbox" className="filled-in"
                   onChange={this.handleChangeAuthor.bind(this, author.key)} checked={authors.has(author.key)}/>
            <label htmlFor={id}>{author.key} ({author.doc_count})</label>
          </li>
        );
      });
    }

    let booktitleComponents;
    if (aggregations.booktitle.buckets.length > 1) {
      booktitleComponents = aggregations.booktitle.buckets.map((booktitle, index) => {
        const id = `booktitle${index}`;
        return (
          <li key={id}>
            <input id={id} type="checkbox" className="filled-in"
                   onChange={this.handleChangeBooktitle.bind(this, booktitle.key)}
                   checked={booktitles.has(booktitle.key)}/>
            <label htmlFor={id}>{booktitle.key} ({booktitle.doc_count})</label>
          </li>
        );
      });
    }

    return (
      <div className="row">
        <div className="col s4 l3">
          <p>Publication Year</p>
          <div className="publication-year">
            {year}
          </div>

          <p>Author</p>
          <ul>
            {authorComponents}

          </ul>

          <p>Booktitle</p>
          <ul>
            {booktitleComponents}
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
