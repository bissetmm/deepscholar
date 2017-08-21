import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import './style.css';

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

export const Document = withRouter(class Document extends Component {
  handleClick(documentUrl, e) {
    window.sessionStorage.setItem(this.props.location.key, window.scrollY);
    this.props.history.push(documentUrl);
  }

  render() {
    const {id, title, booktitle, year, abstract, url, author} = this.props.data;
    const documentUrl = `/documents/${id}`;
    const pdfannoUrl = `https://paperai.github.io/pdfanno/?pdf=${url}`;
    const authors = <Authors data={author}/>;

    return (
      <article className="document">
        <div className="divider"></div>
        <header>
          <h5><a href="javascript:void(0)" onClick={this.handleClick.bind(this, documentUrl)}>{title}</a></h5>
          {authors}
          <h6>{booktitle} {year}</h6>
        </header>
        <p className={this.props.isTruncate ? "truncate" : ""}>{abstract}</p>
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
});

export class Documents extends Component {
  render() {
    const documents = this.props.data.map((document) =>
      <Document data={document} key={document.id} isTruncate={true}/>
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