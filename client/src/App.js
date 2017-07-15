import React, {Component} from 'react';
import _ from 'lodash';
import './App.css';

class Authors extends Component {
  render() {
    const authors = this.props.data.slice(0, 2).map((author) => {
      return <li key={author} className="red-text">{author}</li>;
    });
    const clampLetter = this.props.data.length > 3 ? <li key="clamp" className="red-text">...</li> : '';

    return (
      <ul className="meta authors">
        {authors}
        {clampLetter}
      </ul>
    );
  }
}

class Document extends Component {
  render() {
    const title = this.props.data.title;
    const booktitle = this.props.data.booktitle;
    const year = this.props.data.year;
    const id = this.props.data.id;
    const abstract = this.props.data.abstract;
    const url = this.props.data.url;
    const pdfannoUrl = `http://pdfanno.hshindo.com/?pdf=${url}`;

    const authors = <Authors data={this.props.data.author}/>;

    return (
      <article className="document">
        <div className="divider"></div>
        <header>
          <h5><a href={url} target="_blank">{title}</a></h5>
          {authors}
          <h6>{booktitle} {year}</h6>
        </header>
        <blockquote>{abstract}</blockquote>
        <footer>
          <ul className="meta links valign-wrapper blue-text">
            <li>
              <div className="valign-wrapper"><i className="material-icons">picture_as_pdf</i><a href={url}
                                                                                                 target="_blank">pdf</a>
              </div>
            </li>
            <li><a href={pdfannoUrl} target="_blank">pdfanno</a></li>
          </ul>
        </footer>
      </article>
    );
  }
}

class Documents extends Component {
  render() {
    const documents = this.props.data.map((document) => {
      return <Document data={document} key={document.id}/>;
    });

    return (
      <div>
        {documents}
      </div>
    );
  }
}

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
    this.searchTimer = null;
    this.state = {documents: [], documentsTotal: null, documentPage: 0, documentsFetchSize: 20, query: null};
  }

  fetchApi(path) {
    return fetch(path, {accept: "application/json"})
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response;
        }
      })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        return json;
      });
  }

  componentDidMount() {
    const e = {
      target: {
        value: 'name'
      }
    };
    this.handleTextChange(e);
  }

  handleTextChange(e) {
    if (this.searchTimer !== null) {
      clearTimeout(this.searchTimer);
      this.searchTimer = null;
    }

    const query = e.target.value;
    if (!query) {
      return;
    }

    this.searchTimer = setTimeout(() => {
      this.search(query, 0);
    }, 1000);
    this.setState({query: query, documentPage: 0});
  }

  search(query, page) {
    const from = page * this.state.documentsFetchSize;
    this.fetchApi(`api/search?q=${this.state.query}&size=${this.state.documentsFetchSize}&from=${from}`)
      .then((json) => {
        this.setState({
          documents: json.hits.hits.map((item) => {
            return item._source;
          })
        });
        this.setState({documentsTotal: json.hits.total});
      });
  }

  handleChangePage(page) {
    this.search(this.state.query, page);
    this.setState({documentPage: page});
  }

  render() {
    return (
      <div>
        <div className="navbar-fixed">
          <nav className="navy">
            <div className="nav-wrapper">
              <div className="row">
                <div className="col s4 l3 hide-on-med-and-down">
                  <a href="#" className="brand-logo"><i className="material-icons">cloud</i>DeepScholar</a>
                </div>
                <div className="col s9 l7">
                  <div className="input-field">
                    <input type="search" onChange={this.handleTextChange.bind(this)}
                           placeholder="Word Representations"/>
                    <label className="label-icon" htmlFor="search"><i className="material-icons">search</i>
                    </label>
                    <i className="material-icons closed">close</i>
                  </div>
                </div>
                <div className="col s3 l2 right">
                  <ul className="right">
                    <li><a href="#"><i className="material-icons">view_module</i></a></li>
                    <li><a href="#"><i className="material-icons">refresh</i></a></li>
                    <li><a href="#"><i className="material-icons">more_vert</i></a></li>
                  </ul>
                </div>
              </div>
            </div>
          </nav>
        </div>
        <div className="container">
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
        </div>
      </div>
    );
  }
}

export default App;

