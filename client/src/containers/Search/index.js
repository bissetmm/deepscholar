import React, {Component} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {RangeSliderHistogram} from 'searchkit';
import {Papers} from '../../components/index.js';
import Api from '../../api';
import {
  changeQuery, changePage, requestPapers, receivePapers, deleteScrollY, changeYears,
  changeBooktitle
} from '../../module';
import './style.css';
import 'searchkit/release/theme.css';

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
    const maxPage = Math.floor(this.props.state.papersTotal / this.props.state.papersFetchSize) || 0;
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
  constructor(props) {
    super(props);
    this.searchTimer = null;
    this.articleTitle = null;
    this.author = null;
    this.abstract = null;
  }

  componentDidMount() {
    this.search();
  }

  componentDidUpdate(prevProps) {
    const {query: oldQuery, articleTitle: oldArticleTitle, author: oldAuthor, abstract: oldAbstract, gte: oldGte, lte: oldLte, booktitles: oldBooktitles, page: oldPage} = prevProps.state;
    const {query: newQuery, articleTitle: newArticleTitle, author: newAuthor, abstract: newAbstract, gte: newGte, lte: newLte, booktitles: newBooktitles, page: newPage} = this.props.state;
    if (oldQuery !== newQuery || oldArticleTitle !== newArticleTitle || oldAuthor !== newAuthor || oldAbstract !== newAbstract || oldPage !== newPage || oldGte !== newGte || oldLte !== newLte || Array.from(oldBooktitles).join("") !== Array.from(newBooktitles).join("")) {
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
    const {query, articleTitle, author, abstract, page, gte, lte, booktitles} = this.props.state;
    this.props.dispatch(requestPapers(query, articleTitle, author, abstract, page));
    const from = page * this.props.state.papersFetchSize;
    
    const queryMust = [];
    if (query) {
      queryMust.push(
        {
          bool: {
            should: [
              {
                multi_match: {
                  query,
                  fields: [
                    "id",
                    "articleTitle",
                    "abstract",
                    "url"
                  ]
                }
              },
              {
                nested: {
                  path: "author",
                  query: {
                    multi_match: {
                      query,
                      fields: [
                        "author.surname",
                        "author.givenNames"
                      ]
                    }
                  }
                }
              }
            ]
          }
        }
      );
    }
    if (articleTitle) {
      queryMust.push({
        match: {articleTitle}
      });
    }
    if (author) {
      queryMust.push({
        nested: {
          path: "author",
          query: {
            multi_match: {
              query: author,
              fields: [
                "author.surname",
                "author.givenNames"
              ]
            }
          }
        }
      });
    }
    if (abstract) {
      queryMust.push({
        match: {abstract}
      });
    }

    const postFilterMust = [];
    postFilterMust.push({
      range: {
        year: {
          gte,
          lte
        }
      }
    });
    if (booktitles.size > 0) {
      postFilterMust.push({
        terms: {
          "booktitle.keyword": Array.from(booktitles)
        }
      });
    }

    const body = JSON.stringify({
      query: {
        bool: {
          must: queryMust
        }
      },
      post_filter: {
        bool: {
          must: postFilterMust
        }
      },
      from,
      size: this.props.state.papersFetchSize,
      aggs: {
        year: {
          histogram: {
            field: "year",
            interval: 1
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
      this.props.dispatch(receivePapers(json));
    });
  }

  handleKeyPress(e) {
    if (e.key !== "Enter") {
      return;
    }

    if (this.searchTimer !== null) {
      clearTimeout(this.searchTimer);
      this.searchTimer = null;
    }


    this.searchTimer = setTimeout(() => {
      this.props.dispatch(changeQuery(null, this.articleTitle, this.author, this.abstract));
    }, 0);
  }


  handleChangeArticleTitle(e) {
    this.articleTitle = e.target.value;
  }

  handleChangeAuthor(e) {
    this.author = e.target.value;
  }

  handleChangeAbstract(e) {
    this.abstract = e.target.value;
  }

  handleChangeBooktitle(key) {
    this.props.dispatch(changeBooktitle(key));
  }

  render() {
    const {papers, papersTotal, aggregations, booktitles} = this.props.state;

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

    let booktitleComponents;
    // if (aggregations.booktitle.buckets.length > 1) {
    //   booktitleComponents = aggregations.booktitle.buckets.map((booktitle, index) => {
    //     const id = `booktitle${index}`;
    //     return (
    //       <li key={id}>
    //         <input id={id} type="checkbox" className="filled-in"
    //                onChange={this.handleChangeBooktitle.bind(this, booktitle.key)}
    //                checked={booktitles.has(booktitle.key)}/>
    //         <label htmlFor={id}>{booktitle.key} ({booktitle.doc_count})</label>
    //       </li>
    //     );
    //   });
    // }

    return (
      <div className="row">
        <div className="col s4 l3">
          <h6>Article Title</h6>
          <input type="search" onKeyPress={this.handleKeyPress.bind(this)} onChange={this.handleChangeArticleTitle.bind(this)}
                 defaultValue={this.props.state.articleTitle}/>
          <h6>Author</h6>
          <input type="search" onKeyPress={this.handleKeyPress.bind(this)} onChange={this.handleChangeAuthor.bind(this)}
                 defaultValue={this.props.state.author}/>
          <h6>Abstract</h6>
          <input type="search" onKeyPress={this.handleKeyPress.bind(this)} onChange={this.handleChangeAbstract.bind(this)}
                 defaultValue={this.props.state.abstract}/>

          <h6>Publication Year</h6>
          <div className="publication-year">
            {year}
          </div>

          <h6>Booktitle</h6>
          <ul>
            {booktitleComponents}
          </ul>
        </div>
        <div className="col s8 l9">
          <div className="row">
            <div className="col s12">
              <ul className="tabs">
                <li className="tab col s3"><a href="#tab-texts" className="active">Texts</a></li>
                <li className="tab col s3"><a href="#tab-figures">Figures</a></li>
              </ul>
            </div>
            <div id="tab-texts" className="col s12">
              <p>{papersTotal || 0} results</p>
              <Papers data={papers}/>
              <Paginator/>
            </div>
            <div id="tab-figures" className="col s12">
              <p>{papersTotal || 0} results</p>
              <Papers data={papers}/>
              <Paginator/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Search);
