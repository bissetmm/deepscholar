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
    const highlightedSurnameList = this.props.highlight["author.surname"] || [];
    const highlightedGivenNamesList = this.props.highlight["author.givenNames"] || [];

    const authors = data.map((author) => {
      let surname = author.surname;
      for (const highlightedSurname of highlightedSurnameList) {
        if (highlightedSurname === `<em>${surname}</em>`){
          surname = highlightedSurname;
          break;
        }
      }

      let givenNames = author.givenNames;
      for (const highlightedGivenNames of highlightedGivenNamesList) {
        if (highlightedGivenNames === `<em>${givenNames}</em>`){
          givenNames = highlightedGivenNames;
          break;
        }
      }
      const label = {__html: `${surname} ${givenNames}`};
      return <li key={author.surname + author.givenNames} dangerouslySetInnerHTML={label}></li>;
    });
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

const CheckForFilter = connect(mapStateToProps)(class CheckBoxForFilter extends Component {

  handleChange(e) {
    const target = document.querySelector('.toolBar');
    if( document.querySelectorAll('.paper input:checked').length > 0 ) {
      target.classList.add('choosing');
    } else {
      target.classList.remove('choosing');
    }
  }

  render() {
    const paperId = this.props.paperId;
    return (
      <div className="checkbox">
        <input type="checkbox" id={paperId} className="filled-in" onChange={this.handleChange.bind(this)} />
        <label htmlFor={paperId}></label>
      </div>
    );
  }
});

const FilterLabels = connect(mapStateToProps)(class FilterLabels extends Component {

  render() {
    const {labelList} = this.props.state;
    const labels = Object.keys(labelList).map(key => {
      const labelName = key;
      return <span key={key} className={key + ' ' + labelList[labelName][1]}></span>
    })

    return (
      <span className="filterLabels">
        {labels}
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
    const {id, year, abstract: rawAbstract, articleTitle: rawArticleTitle, journalTitle: rawJournalTitle, author} = this.props.data._source;
    const highlight = this.props.data.highlight || {};
    const {abstract: highlightedAbstract, articleTitle: highlightedArticleTitle, journalTitle: highlightedJournalTitle} = highlight;
    const paperUrl = `/papers/${id}`;
    const authors = <Authors data={author} highlight={highlight} paperId={id} asFull={this.props.asFull}/>;
    const attachmentBaseUrl = `/api/documents/${id}/${id}`;
    const pdfUrl = `${window.location.origin}${attachmentBaseUrl}.pdf`;
    const pdfannoUrl = `https://paperai.github.io/pdfanno/latest/?pdf=${pdfUrl}`;

    const articleTitle = {__html: highlightedArticleTitle || rawArticleTitle};
    const journalTitle = {__html: `${highlightedJournalTitle || rawJournalTitle} ${year}`};

    let abstract = (highlightedAbstract ? highlightedAbstract[0] : rawAbstract) || "";
    if (!this.props.asFull) {
      abstract = this.props.state.enabledFullTextPaperIds.has(id) ? abstract : abstract.substr(0, 400);
    }
    const abstractHtml = {__html: abstract};

    return (
      <article className={'paper ' + 'paper'+id}>
        <div className="divider"></div>
        <CheckForFilter paperId={id} />
        <header>
          <h5>
            <a href="javascript:void(0)" onClick={this.handleClick.bind(this, paperUrl)} dangerouslySetInnerHTML={articleTitle}></a>
            <FilterLabels paperId={id} />
          </h5>
          {authors}
          <h6 dangerouslySetInnerHTML={journalTitle}></h6>
        </header>
        <div className="abstract"
             dangerouslySetInnerHTML={abstractHtml}></div>{abstract !== "" && !this.props.asFull && <FullTextToggle paperId={id}/>}
        <footer>
          <ul className="meta links valign-wrapper blue-text">
            <li>
              <a href={pdfUrl} target="_blank">pdf</a>
            </li>
            <li>
              <a href={`${attachmentBaseUrl}.xml`} target="_blank">xml</a>
            </li>
            <li>
              <a href={`${attachmentBaseUrl}.pdf.txt`} target="_blank">pdf.txt</a>
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
      <Paper data={paper} key={paper._source.id} asFull={false}/>
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
    const title = (caption && caption.title) || label;
    const p = (caption && caption.p) || "";
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
    const element = document.getElementById('figures');
    const lgUid = element.getAttribute('lg-uid');
    if (lgUid) {
      try {
        window.lgData[lgUid].destroy(true);
      } catch (error) {
        console.error(error);
      }
    }

    window.lightGallery(document.getElementById('figures'), {thumbnail: true});
  }

  render() {
    const figures = this.props.data.map((figure) => {
      const {paperId, img, caption, label} = figure;
      const url = (/^https?:\/\//).test(img) ? img : `/api/documents/${paperId}/${img}`;
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

export const Table = withRouter(connect(mapStateToProps)(class Table extends Component {
  handleClick(paperUrl, e) {
    this.props.dispatch(saveScrollY(this.props.location.key, window.scrollY));
    this.props.history.push(paperUrl);
  }

  render() {
    const {paperId, table, label, caption, articleTitle} = this.props.data;
    const paperUrl = `/papers/${paperId}`;
    const html = {__html: `<table class="striped responsive-table">${table}<table>`};
    const footer = ( typeof label !== 'undefined' ? label : '' ) + ' '
                    + ( typeof caption.title !== 'undefined' ? caption.title : '' ) + ' '
                    + ( typeof caption.p !== 'undefined' ? caption.p.join(' ') : '' );

    return (
      <article className="table">
        <div className="divider"></div>
        <header>
          <h5><a href="javascript:void(0)" onClick={this.handleClick.bind(this, paperUrl)}>{articleTitle}</a></h5>
        </header>
        <div dangerouslySetInnerHTML={html}></div>
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
      const {paperId, table, label, caption, articleTitle} = value;
      const data = {paperId, table, label, caption, articleTitle};

      return <Table key={i} data={data} />;
    });

    return (
      <div id="tables">
        {tables}
      </div>
    );
  }
}

export class PlotToolBar extends Component {

  componentDidMount() {          
    window.jQuery('select').material_select();
  }

  render() {
    return (
      <div className="plotToolBar">
        <div className="param param1 col s3">
          <div className="input-field input-field--alpha">
            <select>
              <option value="">Choose your option</option>
              <option value="1">Option 1</option>
              <option value="2">Option 2</option>
              <option value="3">Option 3</option>
            </select>
            <label>X axis parameter</label>
          </div>
        </div>
        <div className="param param2 col s3">
          <div className="input-field input-field--alpha">
            <select>
              <option value="">Choose your option</option>
              <option value="1">Option 1</option>
              <option value="2">Option 2</option>
              <option value="3">Option 3</option>
            </select>
            <label>Y axis parameter</label>
          </div>
        </div>
        <div className="param param3 col s3">
          <div className="input-field input-field--alpha">
            <select>
              <option value="">Choose your option</option>
              <option value="1">Option 1</option>
              <option value="2">Option 2</option>
              <option value="3">Option 3</option>
            </select>
            <label>marker size parameter</label>
          </div>
        </div>
        <div className="param param4 col s3">
          <div className="input-field input-field--alpha">
            <select>
              <option value="">Choose your option</option>
              <option value="1">Option 1</option>
              <option value="2">Option 2</option>
              <option value="3">Option 3</option>
            </select>
            <label>sort data by...</label>
          </div>
        </div>
      </div>
    );
  }
}

export class Plot extends Component {

  componentDidMount() {  
    this.drawPlot();
    this.onResize();
    window.jQuery('.plotSidebar').resizable({ containment: "parent", minWidth: 150, maxWidth: 750, handles: "e",
                                    resize: function(event,ui) { 
                                              const parent = ui.element.context.parentElement;
                                              const anotherWidth = parent.offsetWidth - ui.size.width - 1;
                                              parent.childNodes[1].style.width = anotherWidth + "px";
                                            }
                                  });  
    window.addEventListener("resize", this.onResize.bind(this));
  }

  componentWillUnmount() {
    const tgt = document.querySelector('.sidebar');
    tgt.classList.remove('on');
    tgt.childNodes[0].style.width = "";
    window.removeEventListener("resize", this.onResize.bind(this));
  } 

  onResize(){
    // Add sidebar & main width
    const elem = document.querySelector('.plotSidebar');
    const parent = elem.parentElement;
    const anotherWidth = parent.offsetWidth - elem.offsetWidth - 1;
    parent.childNodes[1].style.width = anotherWidth + "px";
    // Add sidebar height
    const height = document.querySelector('.plotMain').offsetHeight;
    elem.style.height = height + "px";
  }

  drawPlot(){
    const Plotly = window.Plotly;

    const target = Plotly.d3.select('#plotly');
    const targetNode = target.node();

    //////
    // sample data
    const trace1 = {
      x: [], y: [],
      mode: 'markers',
      marker: { color: 'rgba(244, 67, 54, 0.9)',
                size: 12}
    };
    for (let i = 0; i < 50; i++) {
      trace1.x[i] = Math.random() * 6;
      trace1.y[i] = Math.random() * 101 + 40;
    }
    const trace2 = {
      x: [], y: [],
      mode: 'markers',
      marker: {
        color: 'rgba(33, 150, 243, 0.9)',
        size: 9}
    };    
    for (let i = 0; i < 100; i++) {
      trace2.x[i] = i/10 + Math.random() * 2;
      trace2.y[i] = Math.random() * 25;
    }
    const trace3 = {
      x: [], y: [],
      mode: 'markers',
      marker: {
        color: 'rgba(255, 152, 0, 0.9)',
        size: 6}
    };
    for (let i = 0; i < 100; i++) {
      trace3.x[i] = i/10 + Math.random() * 2;
      trace3.y[i] = i + Math.random() * 35;
    }    
    const data = [ trace1, trace2, trace3 ];
    // sample data
    //////
    const layout = {  width: document.querySelector('#plotly').offsetWidth,
                      title: 'A Data Plot'};

    Plotly.plot(targetNode, data, layout);

    window.onresize = function() {
      Plotly.Plots.resize(targetNode);
    };
  }

  handleClick(e){
    const tgt = document.querySelector('.sidebar');
    const width = document.querySelector('.plotSidebar').offsetWidth;
    tgt.classList.toggle('on');
    tgt.childNodes[0].style.width = width + "px";
  }

  render() {
    return (
      <div className="plotMain">
        <div className="toggleFilter" onClick={this.handleClick.bind(this)}><i className="material-icons">find_in_page</i></div>        
        <div id="plotly"></div>
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
