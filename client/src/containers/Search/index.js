import React, {Component} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {withRouter, HashRouter, Switch, Route} from 'react-router-dom';
import {RangeSliderHistogram} from 'searchkit';
import {Papers, Figures, Tables} from '../../components/index.js';
import Api from '../../api';
import { changeQuery, changePage, requestPapers, receivePapers, requestFigures, receiveFigures, requestTables, receiveTables, deleteScrollY, changeYears
  , changeBooktitle, updateLabeledPaper, updateLabelFilter } from '../../module';
import './style.css';
import 'searchkit/release/theme.css';
import Detail from "../Detail";

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
    this.changePage(this.props.page - 1);
  }

  handleNextClick(e) {
    e.preventDefault();
    this.changePage(this.props.page + 1);
  }

  changePage(page) {
    this.props.dispatch(changePage(page));
  }

  render() {
    const maxPage = Math.floor(this.props.total / this.props.size) || 0;
    if (maxPage === 0) {
      return null;
    }

    const currentPage = this.props.page;
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
      <ul className="pagination pagination--alpha center-align">
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

const FilterStyle = connect(mapStateToProps)(class FilterStyle extends Component {

  render() {
    const {labelList} = this.props.state;
    let style = '';

    Object.keys(labelList).map(key => {
      const labelName = key;
      const color = labelList[labelName][0];
      const list = labelList[labelName][1];
      list.map(function(val, i) {
        style += '.paper' + val + ' h5 .' + key + ' { margin: 0 4px; }';
        style += '.paper' + val + ' h5 .' + key + ':after { content: "' + key + '"; }';
      })
    })

    return <style>{style}</style>;
  }
});

const FilterList = connect(mapStateToProps)(class FilterList extends Component {

  render() {
    const {labelList} = this.props.state;
    const {name, txt} = this.props;

    const headTxt = txt == 'Labels' ? 'Filter by label' : 'Apply labels';

    const lists = Object.keys(labelList).map(key => {
      const labelName = key;
      const color = labelList[labelName][0];
      return ( 
        <li key={labelName} className={labelName} data-name={labelName} onClick={this.props.onClickList}>
          <i className="material-icons check">check</i>
          <i className="material-icons remove">remove</i>
          <span className={'color ' + color}></span>{labelName}
        </li>
      )
    });

    return (
      <div className={'dropdown dropdown--alpha ' + name}>
        <a className='dropdown-button btn z-depth-0' data-beloworigin="true" data-activates={name} onClick={this.props.onClickBtn}>{txt}<i className="material-icons">arrow_drop_down</i></a>
        <ul id={name} className='dropdown-content z-depth-0'>
          <li className='head'>{headTxt}<i className="material-icons close">close</i></li>
          {lists}
        </ul>
      </div>
    )
  }
});

const FilterNormal = connect(mapStateToProps)(class FilterNormal extends Component {

  addFilter(labelName){
    const labelFilter = this.props.state.labelFilter.slice();
    const newList = labelFilter
                      .concat(labelName) // Marge
                      .filter(function (x,i,self) { return self.indexOf(x) === i; }); // Remove overlap
    this.props.dispatch( updateLabelFilter(newList) );
  }
  removeFilter(labelName){
    const labelFilter = this.props.state.labelFilter.slice();
    const newList = labelFilter.filter(function(v){ return v != labelName; }); // remove
    this.props.dispatch( updateLabelFilter(newList) );
  }
  removeAllFilter(){
    const newList = [];
    this.props.dispatch( updateLabelFilter(newList) );
  }

  handleClickList(e) {
    const target = e.currentTarget;
    const label = target.dataset.name;

    const self = this;
    setTimeout(function(){ // Do after animation
      if( !target.classList.contains('chkAll') ) {
        target.classList.add('chkAll');
        self.addFilter(label);
      } else {
        target.classList.remove('chkAll');  
        self.removeFilter(label);
      }
    },300);
  }

  handleClick(e) {
    const target = e.currentTarget;
    const self = this;
    setTimeout(function(){ // Do after animation
      const normalFilter = document.getElementById('normalFilter');
      const li = normalFilter.childNodes;
      for( let i = 0; i < li.length; i++ ) {
          li[i].classList.remove('chkAll');  
      }
      self.removeAllFilter();
    },300);
  }

  render() {
    const labelFilter = this.props.state.labelFilter.slice();
    let closeBtn;
    if( labelFilter.length > 0 ) {
      closeBtn = <a className="isFilter" onClick={this.handleClick.bind(this)}><i className="material-icons">close</i>Clear current filters</a>;
    }
    return (
      <div>
        {closeBtn}
        <FilterList name="normalFilter" txt="Labels" onClickList={this.handleClickList.bind(this)} />
      </div>
    )
  }
});

const FilterChoose = connect(mapStateToProps)(class FilterChoose extends Component {

  getCheckedList(){
    const target = document.querySelectorAll('.paper input:checked');
    const list = [];
    [].forEach.call(target, function(e) {
      list.push(e.id)
    });
    return list;
  }

  addLabel(target) {
    const label = target.dataset.name;
    const chkList = this.getCheckedList();
    const labelList = Object.assign({}, this.props.state.labelList);
    const newList = labelList[label][1]
                      .concat(chkList) // Marge
                      .filter(function (x,i,self) { return self.indexOf(x) === i; }); // Remove overlap

    this.props.dispatch( updateLabeledPaper(label, newList) );
  }

  removeLabel(target) {
    const label = target.dataset.name;
    const chkList = this.getCheckedList();
    const oldList = this.props.state.labelList[label][1].slice();
    let newList = [];
    oldList.map(function(val, i) {
      const index = chkList.indexOf(val);
      if (index === -1) newList.push(val);
    });
    this.props.dispatch( updateLabeledPaper(label, newList) );
  }

  handleClickList(e) {
    const target = e.currentTarget;
    if( target.classList.contains('chk') || target.classList.contains('chkAll') ) {
      this.removeLabel(target);  
    } else {
      this.addLabel(target);  
    }

    const filterLabel = document.querySelector('.toolBar');
    filterLabel.classList.remove('choosing');

    const filterChooseAll = document.querySelector('#checkAll');
    filterChooseAll.checked = false;      
  }

  handleClickBtn(e) {    
    const list = this.getCheckedList();
    const {labelList} = this.props.state;
    Object.keys(labelList).map(key => {
      const labelName = key;      
      let result = 0;
      let count = 0;
      list.map(function(val, i) {
        if( labelList[labelName][1].includes(list[i]) ) {
          result = 1;
          count++;
        }
      });
      if( count === list.length ) {
        result = 2; 
      }
      const target = document.querySelector('.toolBar .chooseFilter li.' + labelName);
      target.classList.remove('chkAll', 'chk');
      switch (result) {
        case 2:
          target.classList.add('chkAll');
          break;
        case 1:
          target.classList.add('chk');
          break;
      }
    })
  }

  render() {
    return (
      <div>
        <FilterList name="chooseFilter" txt="Label" onClickBtn={this.handleClickBtn.bind(this)} onClickList={this.handleClickList.bind(this)} />
        <FilterStyle/>
      </div>
    );
  }
});

const ToolBar = connect(mapStateToProps)(class ToolBar extends Component {

  handleChange(e) {
    const chks = document.querySelectorAll('.paper input[type="checkbox"]');
    const filterLabel = document.querySelector('.toolBar');
    for( let i = 0; i < chks.length; i++ ) {
      chks[i].checked = e.target.checked;      
    }
    if ( e.target.checked === true ) {
      filterLabel.classList.add('choosing');
    } else {
      filterLabel.classList.remove('choosing');
    }
  }

  render() {

    return (
      <div className="toolBar">

        <div className="checkbox">
          <input type="checkbox" id="checkAll" className="filled-in" onChange={this.handleChange.bind(this)} />
          <label htmlFor="checkAll"></label>
        </div>

        <FilterNormal />
        <FilterChoose />
      </div>
    );

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

  componentWillMount(){
    document.body.classList.add("search");
  }

  componentWillUnmount(){
    document.body.classList.remove("search");
  }

  componentDidMount() {
    this.search(this.props.state.category);
    window.jQuery('ul.tabs').tabs();
    window.jQuery('.dropdown-button').dropdown();
  }


  componentDidUpdate(prevProps) {
    const {category: oldCategory, query: oldQuery, articleTitle: oldArticleTitle, author: oldAuthor, abstract: oldAbstract, gte: oldGte, lte: oldLte, booktitles: oldBooktitles, page: oldPage, labelFilter: oldlabelFilter} = prevProps.state;
    const {category: newCategory, query: newQuery, articleTitle: newArticleTitle, author: newAuthor, abstract: newAbstract, gte: newGte, lte: newLte, booktitles: newBooktitles, page: newPage, labelFilter: newlabelFilter} = this.props.state;
    if (oldCategory !== newCategory || oldQuery !== newQuery || oldArticleTitle !== newArticleTitle || oldAuthor !== newAuthor || oldAbstract !== newAbstract || oldPage !== newPage || oldGte !== newGte || oldLte !== newLte || Array.from(oldBooktitles).join("") !== Array.from(newBooktitles).join("") || oldlabelFilter !== newlabelFilter) {

      this.search(newCategory);
    }


    const locationKey = this.props.location.key;
    if (!this.props.state.scrollYPositions.has(locationKey)) {
      return;
    }
    const scrollY = this.props.state.scrollYPositions.get(locationKey);
    this.props.dispatch(deleteScrollY(locationKey));

    window.scrollTo(0, scrollY);
  }

  search(category) {
    switch (category) {
      case "figures":
        this.searchFigures();
        break;
      case "tables":
        this.searchTables();
        break;
      default:
        this.searchPapers();
        break;
    }
  }

  searchPapers() {
    const {query, articleTitle, author, abstract, page, gte, lte, booktitles, labelList, labelFilter} = this.props.state;
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
                    "journalTitle",
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
                        "author.*"
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
                "author.*"
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

    let filterdList = [];
    labelFilter.map(function(e, i) {
      filterdList = filterdList
                      .concat(labelList[e][1])
                      .filter(function (x, i, self) {
                        return self.indexOf(x) === i;
                      });
      if( filterdList.length == 0 ) { filterdList.push("") }; // for empty filter
    })
    const labelFilterList = filterdList.length > 0 ? { terms: { _id: filterdList } } : null;

    const body = JSON.stringify({
      query: {
        bool: {
          must: queryMust
        }
      },
      post_filter: {
        bool: {
          must: postFilterMust,
          filter: labelFilterList
        },
      },
      from,
      size: this.props.state.papersFetchSize,
      highlight: {
        fields: {
          articleTitle: {number_of_fragments: 0},
          journalTitle: {number_of_fragments: 0},
          abstract: {number_of_fragments: 0},
          "author.*": {number_of_fragments: 0}
        }
      },
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
        },
      }
    });
    Api.searchPapers({body}).then((json) => {
      this.props.dispatch(receivePapers(json));
    });
  }

  searchFigures() {
    const {query, page} = this.props.state;
    this.props.dispatch(requestFigures(query, page));

    const bodyParams = {
      size: this.props.state.figuresFetchSize
    };

    if (query) {
      bodyParams.query = {
        bool: {
          must: {
            nested: {
              path: "caption",
              query: {
                multi_match: {
                  query,
                  fields: [
                    "caption.p",
                    "caption.title"
                  ]
                }
              }
            }
          }
        }
      };
    }

    const body = JSON.stringify(bodyParams);
    Api.searchFigs({body}).then((json) => {
      this.props.dispatch(receiveFigures(json));
    });
  }

  searchTables() {
    const {query, page} = this.props.state;
    this.props.dispatch(requestTables(query, page));

    const from = page * this.props.state.papersFetchSize;

    const bodyParams = {
      from,
      size: this.props.state.tablesFetchSize,
    };

    if (query) {
      bodyParams.query = {
        bool: {
          should: [
            {
              multi_match: {
                query,
                fields: [
                  "articleTitle",
                ]
              }
            },
            {
              nested: {
                path: "caption",
                query: {
                  multi_match: {
                    query,
                    fields: [
                      "caption.p",
                      "caption.title"
                    ]
                  }
                }
              }
            }
          ]
        }
      };
    }

    const body = JSON.stringify(bodyParams);
    Api.searchTables({body}).then((json) => {
      this.props.dispatch(receiveTables(json));
    });
  }

  changeQuery(category, query) {
    if (this.searchTimer !== null) {
      clearTimeout(this.searchTimer);
      this.searchTimer = null;
    }


    this.searchTimer = setTimeout(() => {
      this.props.dispatch(changeQuery(category, query, this.articleTitle, this.author, this.abstract));
    }, 0);
  }

  handleKeyPress(e) {
    if (e.key !== "Enter") {
      return;
    }

    this.changeQuery(this.props.state.category, null);
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

  handleClickTab(category) {
    this.changeQuery(category, this.props.state.query);
  }

  render() {
    const {page, papers, papersTotal, papersFetchSize, aggregations, booktitles, figures, figuresTotal, tables, tablesTotal, tablesFetchSize} = this.props.state;

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

    const categories = [
      "texts",
      "figures",
      "tables"];

    return (
        <div>
          <div className="subNavi z-depth-0">
            <div className="container">
              <div className="row">
                <div className="results col s4 l3">
                  <Switch>
                    <Route path="/figures" component={(props) => (
                        <p><span className="num">{figuresTotal || 0}</span> results</p>
                    )}/>
                    <Route path="/tables" component={(props) => (
                        <p><span className="num">{tablesTotal || 0}</span> results</p>
                    )}/>
                    <Route component={(props) => (
                        <p><span className="num">{papersTotal || 0}</span> results</p>
                    )}/>
                  </Switch>
                </div>

                <div className="col s8 l9">
                  <ul className="tabs tabs--alpha">
                    {categories.map((category) => {
                      let icon;
                      switch (category) {
                        case 'texts' : 
                          icon = 'font_download'; break;
                        case 'figures' : 
                          icon = 'image'; break;
                        case 'tables' : 
                          icon = 'grid_on'; break;
                        default:
                          icon = '';
                      }

                      return <li key={category} className="tab" onClick={this.handleClickTab.bind(this, category)}>
                        <a className={this.props.state.category === category ? 'active' : ''}>
                          <span className="txt">
                            <i className="material-icons hide-on-small-only">{icon}</i>
                            {category}
                          </span>
                        </a>
                      </li>;
                    })
                    }
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col s4 l3 sidebar">            
              <div className="col s4 l3">
                <h5><i className="material-icons">find_in_page</i>Filter</h5>
                <div>                

                <Switch>
                  <Route path="/figures" component={(props) => (
                      <div></div>
                  )}/>
                  <Route path="/tables" component={(props) => (
                      <div></div>
                  )}/>
                  <Route component={(props) => (
                    <div>
                      <h6>Article Title</h6>
                      <input className="alpha" type="search" placeholder="enter article title" onKeyPress={this.handleKeyPress.bind(this)} onChange={this.handleChangeArticleTitle.bind(this)}
                             defaultValue={this.props.state.articleTitle}/>
                      <h6>Author</h6>
                      <input className="alpha" type="search" placeholder="enter author" onKeyPress={this.handleKeyPress.bind(this)} onChange={this.handleChangeAuthor.bind(this)}
                             defaultValue={this.props.state.author}/>
                      <h6>Abstract</h6>
                      <input className="alpha" type="search" placeholder="enter abstract" onKeyPress={this.handleKeyPress.bind(this)} onChange={this.handleChangeAbstract.bind(this)}
                             defaultValue={this.props.state.abstract}/>
                    </div>
                  )}/>
                </Switch>

                  <h6>Publication Year</h6>
                  <div className="publication-year">
                    {year}
                  </div>

                  <h6>Booktitle</h6>
                  <ul>
                    {booktitleComponents}
                  </ul>

                </div>
              </div>
            </div>
            <div className="contents col s8 l9">

              <ToolBar/>

              <div className="row">

                  <Switch>
                    <Route path="/figures" component={(props) => (
                      <div className="col s12">
                        <Figures data={figures}/>
                      </div>
                    )}/>
                    <Route path="/tables" component={(props) => (
                      <div className="col s12">
                        <Tables data={tables}/>
                        <Paginator total={tablesTotal} size={tablesFetchSize} page={page}/>
                      </div>
                    )}/>
                    <Route component={(props) => (
                      <div className="col s12">
                        <Papers data={papers}/>
                        <Paginator total={papersTotal} size={papersFetchSize} page={page}/>
                      </div>
                    )}/>
                  </Switch>
              </div>
            </div>
          </div>
        </div>
    );
  }
}

export default connect(mapStateToProps)(Search);
