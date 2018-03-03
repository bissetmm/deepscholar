import update from 'immutability-helper';
import queryString from 'query-string';

const matches = window.location.hash.match(/#\/([a-zA-Z]+).*\?(.+)/);
const queries = matches ? matches[2] : "";
const parsed = queryString.parse(queries);
const category = matches ? matches[1] : null;
const labelColor = ["red", "blue", "green", "grey", "yellow", "orange", "pink", "purple" ];
const labelList = {
                    "label1" : ["label1", labelColor[0] , [] ] , // labelName : [name, color, paperList]
                    "label2" : ["label2", labelColor[1] , [] ] ,
                    "label3" : ["label3", labelColor[2] , [] ] ,
                    "label4" : ["label4", labelColor[3] , [] ] ,
                    "label5" : ["label5", labelColor[4] , [] ]
                  };

const initialState = {
  user: null,
  category: category || null,
  query: parsed.q || null,
  articleTitle: parsed.articleTitle || null,
  author: parsed.author || null,
  abstract: parsed.abstract || null,
  gte: Number(parsed.gte) || null,
  lte: Number(parsed.lte) || null,
  booktitles: new Set(parsed["booktitle[]"] || []),
  page: (parsed.page || 1) - 1,
  paperId: null,
  paper: null,
  papers: [],
  paperTotal: 0,
  papersFetchSize: 20,
  figures: [],
  figuresTotal: 0,
  figuresFetchSize: 10000,
  labelColor: labelColor,
  labelList: labelList,
  labelFilter: [],
  tables: [],
  tablesTotal: 0,
  tablesFetchSize: 20,
  aggregations: {
    year: {
      buckets: []
    },
    booktitle: {
      buckets: []
    }
  },
  enabledFullTextPaperIds: new Set(),
  enabledAllAuthorsPaperIds: new Set(),
  scrollYPositions: new Map()
};

////// ▼ Functions for Getting LabelList from DB ▼
const _getLabelList = function(user){
  let labelListSaved;
  let is_available = false;
  const getLabelListFromLocalStrage = function(){
    const labelListInLS = window.localStorage.getItem('labelList'); 
    return  ( labelListInLS && _validateLabelList( JSON.parse(labelListInLS) ) ) ? JSON.parse(labelListInLS) : labelList;
  }
  if ( user !== undefined && user.profile !== undefined ) {    
    window.jQuery.ajax({ async: false, url: '/api/label/get?profile_id=' + user.profile.id })
    .done(function(data) { 
      if( data !== 'error' ) {
        labelListSaved = JSON.parse(data.label.labelList);
        if( _validateLabelList(labelListSaved) ) is_available = true;
      }
    }).fail(function() { console.log('LabelList Get Error.'); });
  }
  labelListSaved = is_available ? labelListSaved : getLabelListFromLocalStrage();
  return labelListSaved;
}

const _saveLabelList = function(labelList, user){
  if ( user && _validateLabelList(labelList) ) { 
    window.jQuery.ajax({ url: '/api/label/set?profile_id=' + user.profile.id + '&labelList=' + JSON.stringify(labelList) })
    .done(function(data) { 
      ( data === 'done' ) ? console.log('LabelList Saved.') : console.log('LabelList Save Failed.');
    })
    .fail(function() { console.log('LabelList Save Ajax Error.') });
  } 
  window.localStorage.setItem('labelList', JSON.stringify(labelList));
}

const _validateLabelList = function(labelList){
  let is_labelList = true;
  let key;
  if( typeof labelList !== 'object' ) is_labelList = false;
  for (key in labelList) {
    if( typeof key !== 'string' || typeof labelList[key][0] !== 'string' || labelColor.indexOf(labelList[key][1]) == -1 || !Array.isArray(labelList[key][2]) ) is_labelList = false;
  }
  return is_labelList;
}
////// ▲ Functions for Getting LabelList from DB ▲

export function reducers(state = initialState, action) {
  switch (action.type) {
    case SIGNED_IN:
      return Object.assign({}, state, {
        user: action.user
      });
    case SIGNED_OUT:
      return Object.assign({}, state, {
        user: null
      });
    case CHANGE_QUERY:
      return Object.assign({}, state, {
        category: action.category || null,
        query: action.query || null,
        articleTitle: action.articleTitle || null,
        author: action.author || null,
        abstract: action.abstract || null,
        gte: null,
        lte: null,
        booktitles: new Set(),
        page: 0,
        scrollYPositions: new Map()
      });
    case CHANGE_YEARS:
      return Object.assign({}, state, {
        gte: action.gte,
        lte: action.lte,
        page: 0,
        scrollYPositions: new Map()
      });
    case CHANGE_BOOKTITLE: {
      const newBooktitles = new Set(state.booktitles);
      if (newBooktitles.has(action.booktitle)) {
        newBooktitles.delete(action.booktitle);
      } else {
        newBooktitles.add(action.booktitle);
      }
      const newState = update(state, {
        page: {$set: 0},
        scrollYPositions: {$set: new Map()},
        booktitles: {$set: newBooktitles}
      });
      return newState;
      }
    case CHANGE_PAGE:
      return Object.assign({}, state, {
        page: action.page
      });
    case REQUEST_PAPER:
      return Object.assign({}, state, {
        paperId: action.paperId
      });
    case RECEIVE_PAPER:
      return Object.assign({}, state, {
        paper: action.paper
      });
    case REQUEST_PAPERS:
      return Object.assign({}, state, {
        query: action.query,
        page: action.page
      });
    case RECEIVE_PAPERS:
      return Object.assign({}, state, {
        papers: action.papers,
        papersTotal: action.papersTotal,
        aggregations: action.aggregations
      });
    case REQUEST_FIGURES:
      return Object.assign({}, state, {
        query: action.query,
        page: action.page
      });
    case RECEIVE_FIGURES:
      return Object.assign({}, state, {
        figures: action.figures,
        figuresTotal: action.figuresTotal,
      });
    case REQUEST_TABLES:
      return Object.assign({}, state, {
        query: action.query,
        page: action.page
      });
    case RECEIVE_TABLES:
      return Object.assign({}, state, {
        tables: action.tables,
        tablesTotal: action.tablesTotal,
      });
    case TOGGLE_FULL_TEXT:
      if (state.enabledFullTextPaperIds.has(action.id)) {
        state.enabledFullTextPaperIds.delete(action.id);
      } else {
        state.enabledFullTextPaperIds.add(action.id);
      }
      return Object.assign({}, state, {
        enabledFullTextPaperIds: state.enabledFullTextPaperIds
      });
    case TOGGLE_ALL_AUTHORS:
      if (state.enabledAllAuthorsPaperIds.has(action.id)) {
        state.enabledAllAuthorsPaperIds.delete(action.id);
      } else {
        state.enabledAllAuthorsPaperIds.add(action.id);
      }
      return Object.assign({}, state, {
        enabledAllAuthorsPaperIds: state.enabledAllAuthorsPaperIds
      });
    case SAVE_SCROLL_Y:
      state.scrollYPositions.set(action.locationKey, action.y);
      return Object.assign({}, state, {
        scrollYPositions: state.scrollYPositions
      });
    case DELETE_SCROLL_Y:
      state.scrollYPositions.delete(action.locationKey);
      return Object.assign({}, state, {
        scrollYPositions: state.scrollYPositions
      });
    case DELETE_ALL_SCROLL_Y:
      return Object.assign({}, state, {
        scrollYPositions: new Map()
      });
    case GET_LABEL_LIST:
      const user = Object.assign({}, state.user);
      const labelListSaved = _getLabelList(user);
      return Object.assign({}, state, {
        labelList: labelListSaved
      });
    case UPDATE_LABEL_LIST:
      const labelListUpdated = action.labelList;
      _saveLabelList(labelListUpdated, state.user);
      return Object.assign({}, state, {
        labelList: labelListUpdated
      });
    case UPDATE_LABEL_FILTER:
      return Object.assign({}, state, {
        labelFilter: action.filterList
      });      
    default:
      return state;
  }
}

const SIGNED_IN = "SIGNED_IN";

export function signedIn(user) {
  return {
    type: SIGNED_IN,
    user
  };
}

const SIGNED_OUT = "SIGNED_OUT";

export function signedOut() {
  return {
    type: SIGNED_OUT,
    user: null
  };
}

const CHANGE_QUERY = "CHANGE_QUERY";

export function changeQuery(category, query, articleTitle, author, abstract) {
  return {
    type: CHANGE_QUERY,
    category,
    query,
    articleTitle,
    author,
    abstract
  };
}

const CHANGE_YEARS = "CHANGE_YEARS";

export function changeYears(gte, lte) {
  return {
    type: CHANGE_YEARS,
    gte,
    lte
  };
}

const CHANGE_BOOKTITLE = "CHANGE_BOOKTITLE";

export function changeBooktitle(booktitle) {
  return {
    type: CHANGE_BOOKTITLE,
    booktitle
  };
}

const CHANGE_PAGE = "CHANGE_PAGE";

export function changePage(page) {
  return {
    type: CHANGE_PAGE,
    page
  };
}

const REQUEST_PAPER = "REQUEST_PAPER";

export function requestPaper(paperId) {
  return {
    type: REQUEST_PAPER,
    paperId
  };
}

const RECEIVE_PAPER = "RECEIVE_PAPER";

export function receivePaper(json) {
  return {
    type: RECEIVE_PAPER,
    paper: json.hits.hits[0]
  };
}

const REQUEST_PAPERS = "REQUEST_PAPERS";

export function requestPapers(query, articleTitle, author, abstract, page) {
  return {
    type: REQUEST_PAPERS,
    query,
    articleTitle,
    author,
    abstract,
    page
  };
}

const RECEIVE_PAPERS = "RECEIVE_PAPERS";

export function receivePapers(json) {
  return {
    type: RECEIVE_PAPERS,
    papers: json.hits.hits,
    papersTotal: json.hits.total,
    aggregations: json.aggregations
  };
}

const REQUEST_FIGURES = "REQUEST_FIGURES";

export function requestFigures(query, page) {
  return {
    type: REQUEST_FIGURES,
    query,
    page
  };
}

const RECEIVE_FIGURES = "RECEIVE_FIGURES";

export function receiveFigures(json) {
  return {
    type: RECEIVE_FIGURES,
    figures: json.hits.hits.map((item) => item._source),
    figuresTotal: json.hits.total
  };
}

const REQUEST_TABLES = "REQUEST_TABLES";

export function requestTables(query, page) {
  return {
    type: REQUEST_TABLES,
    query,
    page
  };
}

const RECEIVE_TABLES = "RECEIVE_TABLES";

export function receiveTables(json) {
  return {
    type: RECEIVE_TABLES,
    tables: json.hits.hits.map((item) => item._source),
    tablesTotal: json.hits.total
  };
}

const TOGGLE_FULL_TEXT = "TOGGLE_FULL_TEXT";

export function toggleFullText(id) {
  return {
    type: TOGGLE_FULL_TEXT,
    id: id
  };
}

const TOGGLE_ALL_AUTHORS = "TOGGLE_ALL_AUTHORS";

export function toggleAllAuthors(id) {
  return {
    type: TOGGLE_ALL_AUTHORS,
    id: id
  };
}

const SAVE_SCROLL_Y = "SAVE_SCROLL_Y";

export function saveScrollY(locationKey, y) {
  return {
    type: SAVE_SCROLL_Y,
    locationKey: locationKey,
    y: y
  };
}

const DELETE_SCROLL_Y = "DELETE_SCROLL_Y";

export function deleteScrollY(locationKey) {
  return {
    type: DELETE_SCROLL_Y,
    locationKey: locationKey
  };
}

const DELETE_ALL_SCROLL_Y = "DELETE_ALL_SCROLL_Y";

export function deleteAllScrollY() {
  return {
    type: DELETE_SCROLL_Y
  };
}

const GET_LABEL_LIST = "GET_LABEL_LIST";

export function getLabelList() {
  return {
    type:GET_LABEL_LIST,
  };
}

const UPDATE_LABEL_LIST = "UPDATE_LABEL_LIST";

export function updateLabelList(labelList) {
  return {
    type: UPDATE_LABEL_LIST,
    labelList: labelList,
  };
}

const UPDATE_LABEL_FILTER = "UPDATE_LABEL_FILTER";

export function updateLabelFilter(filterList) {
  return {
    type: UPDATE_LABEL_FILTER,
    filterList: filterList,
  };
}
