import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import './style.css';
import {saveScrollY, toggleAllAuthors, toggleFullText} from "../module";

function mapStateToProps(state) {
  return {state};
}

const AllAuthorsToggle = connect(mapStateToProps)(class AllAuthorsToggle extends Component {
  handleClick() {
    this.props.dispatch(toggleAllAuthors(this.props.documentId));
  }

  render() {
    const isAllAuthorsEnabled = this.props.state.enabledAllAuthorsDocumentIds.has(this.props.documentId);
    const label = isAllAuthorsEnabled ? "Less" : "More";
    const prefix = isAllAuthorsEnabled ? "" : "...";
    return (
      <span>
        {prefix}<a href="javascript:void(0)" onClick={this.handleClick.bind(this)}>({label})</a>
      </span>
    );
  }
});

const Authors = connect(mapStateToProps)(class Authors extends Component {
  render() {
    let data = this.props.data;
    if (!this.props.asFull && !this.props.state.enabledAllAuthorsDocumentIds.has(this.props.documentId)) {
      data = this.props.data.slice(0, 2);
    }
    const authors = data.map(author =>
      <li key={author.surname + author.givenNames}>{author.surname} {author.givenNames}</li>
    );
    let haveMore = this.props.data.length > 2;

    return (
      <ul className="meta authors">
        {authors}{!this.props.asFull && haveMore && <AllAuthorsToggle documentId={this.props.documentId}/>}
      </ul>
    );
  }
});

const FullTextToggle = connect(mapStateToProps)(class FullTextToggle extends Component {
  handleClick() {
    this.props.dispatch(toggleFullText(this.props.documentId));
  }

  render() {
    const isFullTextEnabled = this.props.state.enabledFullTextDocumentIds.has(this.props.documentId);
    const label = isFullTextEnabled ? "Less" : "More";
    const prefix = isFullTextEnabled ? "" : "...";
    return (
      <span>
        {prefix}<a href="javascript:void(0)" onClick={this.handleClick.bind(this)}>({label})</a>
      </span>
    );
  }
});

export const Document = withRouter(connect(mapStateToProps)(class Document extends Component {
  handleClick(documentUrl, e) {
    this.props.dispatch(saveScrollY(this.props.location.key, window.scrollY));
    this.props.history.push(documentUrl);
  }

  render() {
    const {id, articleTitle, year, url, author} = this.props.data;
    let {abstract} = this.props.data;
    const documentUrl = `/documents/${id}`;
    const pdfannoUrl = `https://paperai.github.io/pdfanno/?pdf=${url}`;
    const authors = <Authors data={author} documentId={id} asFull={this.props.asFull}/>;

    abstract = abstract && abstract.p && abstract.p.map(p => {
      return p;
    }).join() || "";
    if (!this.props.asFull) {
      abstract = this.props.state.enabledFullTextDocumentIds.has(id) ? abstract : abstract.substr(0, 400);
    }

    return (
      <article className="document">
        <div className="divider"></div>
        <header>
          <h5><a href="javascript:void(0)" onClick={this.handleClick.bind(this, documentUrl)}>{articleTitle}</a></h5>
          {authors}
          <h6>{articleTitle} {year}</h6>
        </header>
        <p>{abstract}{!this.props.asFull && <FullTextToggle documentId={id}/>}</p>
        <footer>
          <ul className="meta links valign-wrapper blue-text">
            <li>
              <div className="valign-wrapper">
                <i className="material-icons">picture_as_pdf</i><a href={url} target="_blank">pdf</a>
              </div>
            </li>
            <li><a href={pdfannoUrl} target="_blank">pdfanno</a></li>
          </ul>
        </footer>
      </article>
    );
  }
}));

export class Documents extends Component {
  render() {
    const documents = this.props.data.map((document) =>
      <Document data={document} key={document.id} asFull={false}/>
    );

    return (
      <div>
        {documents}
      </div>
    );
  }
}

export class ScrollToTop extends Component {
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    return this.props.children;
  }
}