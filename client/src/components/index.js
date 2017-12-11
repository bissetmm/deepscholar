import util from 'util';
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
    this.props.dispatch(toggleAllAuthors(this.props.paperId));
  }

  render() {
    const isAllAuthorsEnabled = this.props.state.enabledAllAuthorsPaperIds.has(this.props.paperId);
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
    if (!this.props.asFull && !this.props.state.enabledAllAuthorsPaperIds.has(this.props.paperId)) {
      data = this.props.data.slice(0, 2);
    }
    const authors = data.map(author =>
      <li key={author.surname + author.givenNames}>{author.surname} {author.givenNames}</li>
    );
    const haveMore = this.props.data.length > 2;

    return (
      <ul className="meta authors">
        {authors}{!this.props.asFull && haveMore && <AllAuthorsToggle paperId={this.props.paperId}/>}
      </ul>
    );
  }
});

const FullTextToggle = connect(mapStateToProps)(class FullTextToggle extends Component {
  handleClick() {
    this.props.dispatch(toggleFullText(this.props.paperId));
  }

  render() {
    const isFullTextEnabled = this.props.state.enabledFullTextPaperIds.has(this.props.paperId);
    const label = isFullTextEnabled ? "Less" : "More";
    const prefix = isFullTextEnabled ? "" : "...";
    return (
      <span>
        {prefix}<a href="javascript:void(0)" onClick={this.handleClick.bind(this)}>({label})</a>
      </span>
    );
  }
});

export const Paper = withRouter(connect(mapStateToProps)(class Paper extends Component {
  handleClick(paperUrl, e) {
    this.props.dispatch(saveScrollY(this.props.location.key, window.scrollY));
    this.props.history.push(paperUrl);
  }

  render() {
    const {id, articleTitle, year, url, author} = this.props.data;
    let {abstract} = this.props.data;
    const paperUrl = `/papers/${id}`;
    const pdfannoUrl = `https://paperai.github.io/pdfanno/?pdf=${url}`;
    const authors = <Authors data={author} paperId={id} asFull={this.props.asFull}/>;

    const concatAllString = (o) => {
      if (util.isString(o)) {
        return o;
      }

      if (util.isObject(o)) {
        return Object.keys(o).map((k) => {
          return concatAllString(o[k]);
        }).join();
      }

      if (util.isArray(o)) {
        return o.map((k) => {
          return concatAllString(o[k]);
        }).join();
      }
    };

    abstract = concatAllString(abstract) || "";
    if (!this.props.asFull) {
      abstract = this.props.state.enabledFullTextPaperIds.has(id) ? abstract : abstract.substr(0, 400);
    }

    return (
      <article className="paper">
        <div className="divider"></div>
        <header>
          <h5><a href="javascript:void(0)" onClick={this.handleClick.bind(this, paperUrl)}>{articleTitle}</a></h5>
          {authors}
          <h6>{articleTitle} {year}</h6>
        </header>
        <p>{abstract}{!this.props.asFull && <FullTextToggle paperId={id}/>}</p>
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

export class Papers extends Component {
  render() {
    const papers = this.props.data.map((paper) =>
      <Paper data={paper} key={paper.id} asFull={false}/>
    );

    return (
      <div>
        {papers}
      </div>
    );
  }
}

class Figure extends Component {
  loadAlternativeImage(e) {
    this.props.data.url = "/images/logo.png";
    this.forceUpdate();
  }

  render() {
    const {img, url, caption, label} = this.props.data;
    const title = caption.title || label;
    const p = caption.p || "";
    const subHtml = `<h4>${title}</h4><p>${p}</p>`;
    return (
      <a key={img} href={url} data-sub-html={subHtml} >
        <img src={url} onError={this.loadAlternativeImage.bind(this)}/>
      </a>
    );
  }
}

export class Figures extends Component {
  componentDidUpdate () {
    window.lightGallery(document.getElementById('figures'), {thumbnail: true});
  }

  render() {
    const figures = this.props.data.map((figure) => {
      const {paperId, img, caption, label} = figure;
      const url = (/^https?:\/\//).test(img) ? img : `/static/figs/${paperId}/${img}`;
      const data = {img, url, caption, label};

      return <Figure key={figure.img} data={data} />;
    });

    return (
      <div id="figures">
        {figures}
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
