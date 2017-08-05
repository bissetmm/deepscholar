import React, {Component} from 'react';
import {
  Link
} from 'react-router-dom';
import './style.css';

export class Authors extends Component {
  render() {
    const authors = this.props.data.slice(0, 2).map(author =>
      <li key={author} className="red-text">{author}</li>
    );
    const clampLetter = this.props.data.length > 3 ? <li key="clamp" className="red-text">...</li> : '';

    return (
      <ul className="meta authors">
        {authors}
        {clampLetter}
      </ul>
    );
  }
}

export class Document extends Component {
  render() {
    const {id, title, booktitle, year, abstract, url, author} = this.props.data;
    const documentUrl = `/documents/${id}`;
    const pdfannoUrl = `http://pdfanno.hshindo.com/?pdf=${url}`;
    const authors = <Authors data={author}/>;

    return (
      <article className="document">
        <div className="divider"></div>
        <header>
          <h5><Link to={documentUrl}>{title}</Link></h5>
          {authors}
          <h6>{booktitle} {year}</h6>
        </header>
        <blockquote className="truncate">{abstract}</blockquote>
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
}

export class Documents extends Component {
  render() {
    const documents = this.props.data.map((document) =>
      <Document data={document} key={document.id}/>
    );

    return (
      <div>
        {documents}
      </div>
    );
  }
}
