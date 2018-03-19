import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import './style.css';
import {saveScrollY, toggleAllAuthors, toggleAbstruct, updateLabelList, favoriteKey} from "../module";

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
    const highlightedAuthors = this.props.highlight.authors || [];

    const authors = data.map((author) => {
      let name = author;
      for (const highlightedAuthor of highlightedAuthors) {
        if (highlightedAuthor.replace(/<\/?em>/g, "") === author) {
          name = highlightedAuthor;
          break;
        }
      }
      const label = {__html: `${name}`};
      return <li key={author} dangerouslySetInnerHTML={label}></li>;
    });
    const haveMore = this.props.data.length > 2;

    return (
      <ul className="meta authors">
        {authors}{!this.props.asFull && haveMore && <AllAuthorsToggle paperId={this.props.paperId}/>}
      </ul>
    );
  }
});

const AbstractToggle = connect(mapStateToProps)(class AbstractToggle extends Component {
  handleClick() {
    this.props.dispatch(toggleAbstruct(this.props.paperId));
  }

  render() {
    return (
      <a href="javascript:void(0)" onClick={this.handleClick.bind(this)}>abstract</a>
    );
  }
});

const CheckForFilter = connect(mapStateToProps)(class CheckBoxForFilter extends Component {

  handleChange() {
    const target = document.querySelector('.toolBar');
    if (document.querySelectorAll('.paper input:checked').length > 0) {
      target.classList.add('choosing');
    } else {
      target.classList.remove('choosing');
    }
  }

  render() {
    const paperId = this.props.paperId;
    return (
      <div className="checkbox">
        <input type="checkbox" id={paperId} className="filled-in" onChange={this.handleChange.bind(this)}/>
        <label htmlFor={paperId}></label>
      </div>
    );
  }
});

const Favorite = connect(mapStateToProps)(class CheckBoxForFilter extends Component {

  handleClick(e) {
    const labelList = Object.assign({}, this.props.state.labelList);
    const favList = labelList[favoriteKey];
    const id = e.currentTarget.dataset.id;
    const index = labelList[favoriteKey].indexOf(id);
    // exist ? remove : add;
    if (index !== -1) {
      favList.splice(index, 1);
    } else {
      favList.push(id);
    }
    this.props.dispatch(updateLabelList(labelList));
  }

  render() {
    const paperId = this.props.paperId;
    return (
      <div className="favorite" data-id={paperId} onClick={this.handleClick.bind(this)}>
        <i className="material-icons on">star</i>
        <i className="material-icons off">star_border</i>
      </div>
    );
  }
});

const FilterLabels = connect(mapStateToProps)(class FilterLabels extends Component {

  render() {
    const {labelList} = this.props.state;
    const labels = Object.keys(labelList)
      .map(key => {
        const labelKey = key;
        if (labelKey !== favoriteKey) {
          return <span key={key} className={`${key} ${labelList[labelKey][1]}`}></span>;
        }

        return null;
      });

    return (
      <span className="filterLabels">
        {labels}
      </span>
    );
  }
});

export const Paper = withRouter(connect(mapStateToProps)(class Paper extends Component {

  handleClick(paperUrl) {
    this.props.dispatch(saveScrollY(this.props.location.key, window.scrollY));
    this.props.history.push(paperUrl);
  }

  render() {
    const id = this.props.data._id;
    const {year, abstract: rawAbstract, articleTitle: rawArticleTitle, journalTitle: rawJournalTitle, authors, pdf, xml, pdftxt} = this.props.data._source;
    const highlight = this.props.data.highlight || {};
    const {abstract: highlightedAbstract, articleTitle: highlightedArticleTitle, journalTitle: highlightedJournalTitle} = highlight;
    const paperUrl = `/papers/${id}`;
    const authorComponents = <Authors data={authors} highlight={highlight} paperId={id} asFull={this.props.asFull}/>;
    const pdfannoUrl = `https://paperai.github.io/pdfanno/latest/?pdf=${pdf}`;

    const articleTitle = {__html: highlightedArticleTitle || rawArticleTitle};
    const journalTitle = {__html: `${highlightedJournalTitle || rawJournalTitle} ${year}`};

    const abstract = (highlightedAbstract ? highlightedAbstract[0] : rawAbstract) || "";

    const abstractHtml = {__html: abstract};

    const fullAbstract = this.props.state.enabledFullAbstructPaperIds.has(id);

    const abstractDom = fullAbstract ? (
        <div className="abstract" dangerouslySetInnerHTML={abstractHtml}></div>
      ) : null;

    console.log(abstractDom);

    return (
      <article className={`paper paper${id}`}>
        <div className="divider"></div>
        <CheckForFilter paperId={id}/>
        <Favorite paperId={id}/>
        <header>
          <h5>
            <a href="javascript:void(0)" onClick={this.handleClick.bind(this, paperUrl)}
               dangerouslySetInnerHTML={articleTitle}></a>
            <FilterLabels paperId={id}/>
          </h5>
          {authorComponents}
          <h6 dangerouslySetInnerHTML={journalTitle}></h6>
        </header>
        {abstractDom}
        <footer>
          <ul className="meta links valign-wrapper blue-text">
            <li>
              <AbstractToggle paperId={id}/>              
            </li>
            <li>
              <a href={pdf} target="_blank">pdf</a>
            </li>
            <li>
              <a href={xml} target="_blank">xml</a>
            </li>
            <li>
              <a href={pdftxt} target="_blank">pdf.txt</a>
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
      <Paper data={paper} key={paper._id} asFull={false}/>
    );

    return (
      <div>
        {papers}
      </div>
    );
  }
}

export const Figure = withRouter(connect(mapStateToProps)(class Figure extends Component {
  handleClick(paperUrl) {
    this.props.dispatch(saveScrollY(this.props.location.key, window.scrollY));
    this.props.history.push(paperUrl);
  }

  render() {
    const {img: url, label, caption} = this.props.data._source;
    const paper = this.props.data.inner_hits.text.hits.hits[0];
    const paperId = paper._id;
    const {articleTitle} = paper._source;
    const paperUrl = `/papers/${paperId}`;
    const footer = `${label} ${caption}`;

    return (
      <article className="figure">
        <div className="divider"></div>
        <header>
          <h5><a href="javascript:void(0)" onClick={this.handleClick.bind(this, paperUrl)}>{articleTitle}</a></h5>
        </header>
        <a className="figure-image" key={url} href={url}>
          <img src={url}/>
        </a>
        <footer>
          <h6>{footer}</h6>
        </footer>
      </article>
    );
  }
}));

export class Figures extends Component {
  componentDidUpdate() {
    const element = document.getElementById('figures');
    const lgUid = element.getAttribute('lg-uid');
    if (lgUid) {
      try {
        window.lgData[lgUid].destroy(true);
      } catch (error) {
        console.error(error);
      }
    }
  }

  componentDidMount() {
    window.lightGallery(document.getElementById('figures'), {
      selector: ".figure-image"
    });
  }

  render() {
    const figures = this.props.data.map((value, i) => {
      return <Figure key={i} data={value}/>;
    });

    return (
      <div id="figures">
        {figures}
      </div>
    );
  }
}

export const Table = withRouter(connect(mapStateToProps)(class Table extends Component {
  handleClick(paperUrl) {
    this.props.dispatch(saveScrollY(this.props.location.key, window.scrollY));
    this.props.history.push(paperUrl);
  }

  render() {
    const {img: url, label, caption} = this.props.data._source;
    const paper = this.props.data.inner_hits.text.hits.hits[0];
    const paperId = paper._id;
    const {articleTitle} = paper._source;
    const paperUrl = `/papers/${paperId}`;
    const footer = `${label} ${caption}`;

    return (
      <article className="table">
        <div className="divider"></div>
        <header>
          <h5><a href="javascript:void(0)" onClick={this.handleClick.bind(this, paperUrl)}>{articleTitle}</a></h5>
        </header>
        <img src={url}/>
        <footer>
          <h6>{footer}</h6>
        </footer>
      </article>
    );
  }
}));

export class Tables extends Component {
  render() {
    const tables = this.props.data.map((value, i) => {
      return <Table key={i} data={value}/>;
    });

    return (
      <div id="tables">
        {tables}
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
