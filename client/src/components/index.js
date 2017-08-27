import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import './style.css';
import {toggleFullText} from "../module";

function mapStateToProps(state) {
  return {state};
}

export class Authors extends Component {
  render() {
    const authors = this.props.data.slice(0, 2).map(author =>
      <li key={author}>{author}</li>
    );
    const clampLetter = this.props.data.length > 3 ? <li key="clamp">...</li> : '';

    return (
      <ul className="meta authors">
        {authors}
        {clampLetter}
      </ul>
    );
  }
}

const FullTextToggle = connect(mapStateToProps)(class AbstractChanger extends Component {
  constructor(props) {
    super(props);
  }

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
    window.sessionStorage.setItem(this.props.location.key, window.scrollY);
    this.props.history.push(documentUrl);
  }

  render() {
    const {id, title, booktitle, year, url, author} = this.props.data;
    let {abstract} = this.props.data;
    const documentUrl = `/documents/${id}`;
    const pdfannoUrl = `https://paperai.github.io/pdfanno/?pdf=${url}`;
    const authors = <Authors data={author}/>;

    if (!this.props.isForceFullText) {
      abstract = this.props.state.enabledFullTextDocumentIds.has(id) ? abstract : abstract.substr(0, 400);
    }

    return (
      <article className="document">
        <div className="divider"></div>
        <header>
          <h5><a href="javascript:void(0)" onClick={this.handleClick.bind(this, documentUrl)}>{title}</a></h5>
          {authors}
          <h6>{booktitle} {year}</h6>
        </header>
        <p>{abstract}{!this.props.isForceFullText && <FullTextToggle documentId={id}/>}</p>
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
      <Document data={document} key={document.id} isForceFullText={false}/>
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