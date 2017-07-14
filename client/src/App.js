import React, {Component} from 'react';
import './App.css';

class Authors extends Component {
  render() {
    const authors = this.props.data.map((author) => {
      return <li key={author} className="red-text">{author}</li>;
    });

    return (
      <ul className="meta authors">
        {authors}
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
      <article className="row">
        <div className="divider"></div>
        <header>
          <h5><a href={url} target="_blank">{title}</a></h5>
          {authors}
          <h6>{booktitle} {year}</h6>
        </header>
        <section className="section">
          <blockquote>{abstract}</blockquote>
        </section>
        <footer>
          <ul className="meta links valign-wrapper blue-text">
            <li>
              <div className="valign-wrapper"><i className="material-icons">picture_as_pdf</i><a href={url} target="_blank">pdf</a>
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

class App extends Component {
  constructor(props) {
    super(props);
    this.searchTimer = null;
    this.state = {documents: [], documentsCount: null};
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
      Promise.all([
        this.fetchApi(`api/search?q=${query}`),
        this.fetchApi(`api/count?q=${query}`)
      ]).then((results) => {
        const searchJson = results[0];
        const countJson = results[1];
        this.setState({documents: searchJson});
        this.setState({documentsCount: countJson.count});
      });
    }, 1000);
  }

  render() {
    return (
      <div>
        <div className="navbar-fixed">
          <nav className="light-blue accent-4">
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
              {this.state.documentsCount > 0 &&
                <p>{this.state.documentsCount} results</p>
              }
              <Documents data={this.state.documents}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
