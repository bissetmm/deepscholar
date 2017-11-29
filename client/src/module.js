import update from 'immutability-helper';
import queryString from 'query-string';

const parsed = queryString.parse(window.location.search);
const initialState = {
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

export function reducers(state = initialState, action) {
  switch (action.type) {
    case CHANGE_QUERY:
      return Object.assign({}, state, {
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
    case REQUEST_DOCUMENT:
      return Object.assign({}, state, {
        paperId: action.paperId
      });
    case RECEIVE_DOCUMENT:
      return Object.assign({}, state, {
        paper: action.paper
      });
    case REQUEST_DOCUMENTS:
      return Object.assign({}, state, {
        query: action.query,
        page: action.page
      });
    case RECEIVE_DOCUMENTS:
      return Object.assign({}, state, {
        papers: action.papers,
        papersTotal: action.papersTotal,
        aggregations: action.aggregations
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
    default:
      return state;
  }
}

const CHANGE_QUERY = "CHANGE_QUERY";

export function changeQuery(query, articleTitle, author, abstract) {
  return {
    type: CHANGE_QUERY,
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

const REQUEST_DOCUMENT = "REQUEST_DOCUMENT";

export function requestPaper(paperId) {
  return {
    type: REQUEST_DOCUMENT,
    paperId
  };
}

const RECEIVE_DOCUMENT = "RECEIVE_DOCUMENT";

export function receivePaper(json) {
  return {
    type: RECEIVE_DOCUMENT,
    paper: json.hits.hits.map((item) => item._source)[0]
  };
}

const REQUEST_DOCUMENTS = "REQUEST_DOCUMENTS";

export function requestPapers(query, articleTitle, author, abstract, page) {
  return {
    type: REQUEST_DOCUMENTS,
    query,
    articleTitle,
    author,
    abstract,
    page
  };
}

const RECEIVE_DOCUMENTS = "RECEIVE_DOCUMENTS";

export function receivePapers(json) {
  return {
    type: RECEIVE_DOCUMENTS,
    papers: json.hits.hits.map((item) => item._source),
    papersTotal: json.hits.total,
    aggregations: json.aggregations
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
