import queryString from 'query-string';

const parsed = queryString.parse(window.location.search);
const initialState = {
  query: parsed.q,
  gte: null,
  lte: null,
  page: (parsed.page || 1) - 1,
  documentId: null,
  document: null,
  documents: [],
  documentTotal: 0,
  documentsFetchSize: 20,
  aggregations: {
    year: {
      buckets: []
    }
  },
  enabledFullTextDocumentIds: new Set(),
  enabledAllAuthorsDocumentIds: new Set(),
  scrollYPositions: new Map()
};

export function reducers(state = initialState, action) {
  switch (action.type) {
    case CHANGE_QUERY:
      return Object.assign({}, state, {
        query: action.query,
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
    case CHANGE_PAGE:
      return Object.assign({}, state, {
        page: action.page
      });
    case REQUEST_DOCUMENT:
      return Object.assign({}, state, {
        documentId: action.documentId
      });
    case RECEIVE_DOCUMENT:
      return Object.assign({}, state, {
        document: action.document
      });
    case REQUEST_DOCUMENTS:
      return Object.assign({}, state, {
        query: action.query,
        page: action.page
      });
    case RECEIVE_DOCUMENTS:
      return Object.assign({}, state, {
        documents: action.documents,
        documentsTotal: action.documentsTotal
      });
    case REQUEST_AGGREGATIONS:
      return state;
    case RECEIVE_AGGREGATIONS:
      return Object.assign({}, state, {
        aggregations: action.aggregations
      });
    case TOGGLE_FULL_TEXT:
      if (state.enabledFullTextDocumentIds.has(action.id)) {
        state.enabledFullTextDocumentIds.delete(action.id);
      } else {
        state.enabledFullTextDocumentIds.add(action.id);
      }
      return Object.assign({}, state, {
        enabledFullTextDocumentIds: state.enabledFullTextDocumentIds
      });
    case TOGGLE_ALL_AUTHORS:
      if (state.enabledAllAuthorsDocumentIds.has(action.id)) {
        state.enabledAllAuthorsDocumentIds.delete(action.id);
      } else {
        state.enabledAllAuthorsDocumentIds.add(action.id);
      }
      return Object.assign({}, state, {
        enabledAllAuthorsDocumentIds: state.enabledAllAuthorsDocumentIds
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

export function changeQuery(query) {
  return {
    type: CHANGE_QUERY,
    query
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

const CHANGE_PAGE = "CHANGE_PAGE";

export function changePage(page) {
  return {
    type: CHANGE_PAGE,
    page
  };
}

const REQUEST_DOCUMENT = "REQUEST_DOCUMENT";

export function requestDocument(documentId) {
  return {
    type: REQUEST_DOCUMENT,
    documentId
  };
}

const RECEIVE_DOCUMENT = "RECEIVE_DOCUMENT";

export function receiveDocument(json) {
  return {
    type: RECEIVE_DOCUMENT,
    document: json.hits.hits.map((item) => item._source)[0]
  };
}

const REQUEST_DOCUMENTS = "REQUEST_DOCUMENTS";

export function requestDocuments(query, page) {
  return {
    type: REQUEST_DOCUMENTS,
    query,
    page
  };
}

const RECEIVE_DOCUMENTS = "RECEIVE_DOCUMENTS";

export function receiveDocuments(json) {
  return {
    type: RECEIVE_DOCUMENTS,
    documents: json.hits.hits.map((item) => item._source),
    documentsTotal: json.hits.total
  };
}

const REQUEST_AGGREGATIONS = "REQUEST_AGGREGATIONS";

export function requestAggregations() {
  return {
    type: REQUEST_AGGREGATIONS
  };
}

const RECEIVE_AGGREGATIONS = "RECEIVE_AGGREGATIONS";

export function receiveAggregations(json) {
  return {
    type: RECEIVE_AGGREGATIONS,
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
