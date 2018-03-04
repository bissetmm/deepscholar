import React, {Component} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {withRouter, HashRouter, Switch, Route} from 'react-router-dom';
import {RangeSliderHistogram} from 'searchkit';
import {Papers, Figures, Tables} from '../../components/index.js';
import Api from '../../api';
import { changeQuery, changePage, requestPapers, receivePapers, requestFigures, receiveFigures, requestTables, receiveTables, deleteScrollY, changeYears
  , changeBooktitle, updateLabelList, updateLabelFilter } from '../../module';
import './style.css';
import 'searchkit/release/theme.css';
import Detail from "../Detail";

function mapStateToProps(state) {
  return {state};
}

const Paginator = withRouter(connect(mapStateToProps)(class Paginator extends Component {
  handlePageClick(i, e) {
    e.preventDefault();
    this.changePage(i);
  }

  handlePrevClick(e) {
    e.preventDefault();
    this.changePage(this.props.page - 1);
  }

  handleNextClick(e) {
    e.preventDefault();
    this.changePage(this.props.page + 1);
  }

  changePage(page) {
    this.props.dispatch(changePage(page));
  }

  render() {
    const maxPage = Math.floor(this.props.total / this.props.size) || 0;
    if (maxPage === 0) {
      return null;
    }

    const currentPage = this.props.page;
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
      <ul className="pagination pagination--alpha center-align">
        <li className={prevClassName}><a href="#" onClick={this.handlePrevClick.bind(this)}><i
          className="material-icons">chevron_left</i></a></li>
        {pages}
        <li className={nextClassName}><a href="#" onClick={this.handleNextClick.bind(this)}><i
          className="material-icons">chevron_right</i></a></li>
      </ul>
    );
  }
}));

const PublicationFilter = connect(mapStateToProps)(class PublicationFilter extends Component {
  componentDidUpdate() {
    this.minValue = this.maxValue = null;
  }

  handleOnChange(range) {
    this.minValue = range.min;
    this.maxValue = range.max;
    this.forceUpdate();
  }

  handleOnFinished(range) {
    this.props.dispatch(changeYears(range.min, range.max));
  }

  render() {
    return <RangeSliderHistogram items={this.props.items}
                                 min={this.props.min}
                                 max={this.props.max}
                                 minValue={this.minValue || this.props.minValue}
                                 maxValue={this.maxValue || this.props.maxValue}
                                 onChange={this.handleOnChange.bind(this)}
                                 onFinished={this.handleOnFinished.bind(this)}/>;
  }
});

const FilterEdit = connect(mapStateToProps)(class FilterEdit extends Component {

  handleClickColor(e) {
    const li = e.target.parentNode;
    li.classList.add('editColor');
    e.target.focus();
  }
  handleClickcolorListMusk(e) {
    const li = e.target.parentNode;
    li.classList.remove('editColor');
  }
  handleClickChangeColor(e) {
    const classList = e.target.classList;
    if( classList.contains('cell') && !classList.contains('active') ) {
      const labelList = Object.assign({}, this.props.state.labelList);
      const labelKey = e.target.dataset.key;
      const color = e.target.dataset.color;      
      labelList[labelKey][1] = color;
      this.props.dispatch( updateLabelList(labelList) );
      e.target.parentNode.parentNode.classList.remove('editColor');
    }    
  }

  handleClickAddLabel(e) {
    const labelList = Object.assign({}, this.props.state.labelList);
    const labelColor = this.props.state.labelColor;    
    const length = Object.keys(labelList).length;
    let no = length + 1;
    while( labelList['label'+no] )
    { 
      no++; 
    }
    labelList['label'+no] = ['New label', labelColor[length%8] , [] ];
    this.props.dispatch( updateLabelList(labelList) );
  }

  handleClickRemoveLabel(e) {
    const labelList = Object.assign({}, this.props.state.labelList);
    const labelName = e.target.parentNode.dataset.name;    
    delete labelList[labelName];
    this.props.dispatch( updateLabelList(labelList) );
  }

  handleClickCreate(e) {
    const li = e.target.parentNode;
    const input = li.childNodes[4];
    li.classList.add('edit');
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
    input.value = input.dataset.name;
  }

  createDone(e){
    const li = e.target.parentNode;
    const input = li.childNodes[4];
    li.classList.remove('edit');
    input.blur();
    const labelKey = input.dataset.key; 
    const oldName = input.dataset.name;
    const newName = input.value;
    if( newName == '' || newName == oldName ) {
      return false
    } else {
      const labelList = Object.assign({}, this.props.state.labelList);
      labelList[labelKey][0] = newName;
      this.props.dispatch( updateLabelList(labelList) );
    }
  }
  handleBlurInput(e) {
    this.createDone(e);
  }

  handleKeyUp(e) {

    const input = e.target;
    const li = input.parentNode;
    if( input.value.length >= 20 ){
      li.classList.add('max');
      input.value = input.value.slice( 0, 20)
    } else {
      li.classList.remove('max');
    }
    
    if (e.key === 'Enter') this.createDone(e);
  }

  render() {
    const {labelColor, labelList} = this.props.state;

    const lists = Object.keys(labelList).map(key => {
      const labelKey = key;
      const labelName = labelList[key][0];
      const color = labelList[key][1];
      return ( 
        <li key={labelKey} className={labelKey} data-name={labelKey} onClick={this.props.onClickList}>
          <span className={'color ' + color} data-color={color} onClick={this.handleClickColor.bind(this)}></span>
          <span className="labelName">{labelName}</span>
          <ul className="colorList" onClick={this.handleClickChangeColor.bind(this)}>
            { labelColor.map(function(e, i) {
              const className = 'cell ' + e + ( ( e === color  ) ? ' active' : '' );
              return ( <li key={i} data-key={labelKey} data-color={e} className={className}></li> )
            })}
          </ul>
          <div className="colorListMusk" onClick={this.handleClickcolorListMusk.bind(this)}></div>
          <input type="text" data-key={labelKey} data-name={labelName} onBlur={this.handleBlurInput.bind(this)} onKeyUp={this.handleKeyUp.bind(this)}/>
          <i className="material-icons create" onClick={this.handleClickCreate.bind(this)}>create</i>
          <i className="material-icons delete" onClick={this.handleClickRemoveLabel.bind(this)}>delete</i>
        </li>
      )
    });

    return (
      <div id="filterEditModal" className="filterEditModal modal modal-fixed-footer">
        <div className="modal-content">
          <h4>Edit label</h4>
          <div>
            <ul>
              {lists}
            </ul>
            <div className="right-align">
              <span className="addLabel" onClick={this.handleClickAddLabel.bind(this)}><i className="material-icons add">add</i>Add label</span>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <a className="modal-action modal-close waves-effect waves-green btn-flat ">OK</a>
        </div>
      </div>
    )
  }
});

const FilterListCommon = connect(mapStateToProps)(class FilterListCommon extends Component {

  render() {
    const {labelList} = this.props.state;
    const {name} = this.props;

    const headTxt = name == 'chooseFilter' ? 'Apply labels' : 'Filter by label';

    const lists = Object.keys(labelList).map(key => {
      const labelKey = key;
      const labelName = labelList[key][0];
      const color = labelList[key][1];
      return ( 
        <li key={labelKey} className={labelKey} data-name={labelKey} onClick={this.props.onClickList}>
          <i className="material-icons check">check</i>
          <i className="material-icons remove">remove</i>
          <span className={'color ' + color}></span>{labelName}
        </li>
      )
    });

    return (
      <div className={'dropdown dropdown--alpha ' + name}>
        <a className='dropdown-button btn z-depth-0' data-beloworigin="true" data-activates={name} onClick={this.props.onClickBtn}>Labels<i className="material-icons">arrow_drop_down</i></a>
        <ul id={name} className='dropdown-content z-depth-0'>
          <li className='head'>{headTxt}<i className="material-icons close">close</i></li>
          {lists}
          <li data-target="filterEditModal" className='foot modal-trigger'>Edit label<i className="material-icons create">create</i></li>
        </ul>
      </div>
    )
  }
});

const FilterNormal = connect(mapStateToProps)(class FilterNormal extends Component {

  addFilter(labelName){
    const labelFilter = this.props.state.labelFilter.slice();
    const newFilter = labelFilter
                      .concat(labelName) // Marge
                      .filter(function (x,i,self) { return self.indexOf(x) === i; }); // Remove overlap
    this.props.dispatch( updateLabelFilter(newFilter) );
  }
  removeFilter(labelName){
    const labelFilter = this.props.state.labelFilter.slice();
    const newFilter = labelFilter.filter(function(v){ return v != labelName; }); // remove
    this.props.dispatch( updateLabelFilter(newFilter) );
  }
  removeAllFilter(){
    const newList = [];
    this.props.dispatch( updateLabelFilter(newList) );
  }

  handleClickList(e) {
    const target = e.currentTarget;
    const label = target.dataset.name;

    const self = this;
    setTimeout(function(){ // Do after animation
      if( !target.classList.contains('chkAll') ) {
        target.classList.add('chkAll');
        self.addFilter(label);
      } else {
        target.classList.remove('chkAll');  
        self.removeFilter(label);
      }
    },300);
  }

  handleClick(e) {
    const target = e.currentTarget;
    const self = this;
    setTimeout(function(){ // Do after animation
      const normalFilter = document.getElementById('normalFilter');
      const li = normalFilter.childNodes;
      for( let i = 0; i < li.length; i++ ) {
          li[i].classList.remove('chkAll');  
      }
      self.removeAllFilter();
    },300);
  }

  render() {
    const labelFilter = this.props.state.labelFilter.slice();
    let closeBtn;
    if( labelFilter.length > 0 ) {
      closeBtn = <a className="isFilter" onClick={this.handleClick.bind(this)}><i className="material-icons">close</i>Clear current filters</a>;
    }
    return (
      <div>
        {closeBtn}
        <FilterListCommon name="normalFilter" onClickList={this.handleClickList.bind(this)} />
      </div>
    )
  }
});

const FilterChoose = connect(mapStateToProps)(class FilterChoose extends Component {

  getCheckedList(){
    const target = document.querySelectorAll('.paper input:checked');
    const list = [];
    [].forEach.call(target, function(e) {
      list.push(e.id)
    });
    return list;
  }

  addLabel(target) {
    const labelName = target.dataset.name;
    const checkedList = this.getCheckedList();
    const labelList = Object.assign({}, this.props.state.labelList);
    labelList[labelName][2] = labelList[labelName][2].concat(checkedList) // Marge
                          .filter(function (x,i,self) { return self.indexOf(x) === i; }); // Remove overlap
    this.props.dispatch( updateLabelList(labelList) );
  }

  removeLabel(target) {
    const labelName = target.dataset.name;
    const checkedList = this.getCheckedList();
    const labelList = Object.assign({}, this.props.state.labelList);
    const oldList = this.props.state.labelList[labelName][2].slice();
    let newList = [];
    oldList.map(function(val, i) {
      const index = checkedList.indexOf(val);
      if (index === -1) newList.push(val);
    });
    labelList[labelName][2] = newList;
    this.props.dispatch( updateLabelList(labelList) );
  }

  handleClickList(e) {
    const target = e.currentTarget;
    if( target.classList.contains('chk') || target.classList.contains('chkAll') ) {
      this.removeLabel(target);  
    } else {
      this.addLabel(target);  
    }

    const filterLabel = document.querySelector('.toolBar');
    filterLabel.classList.remove('choosing');

    const filterChooseAll = document.querySelector('#checkAll');
    filterChooseAll.checked = false;      
  }

  handleClickBtn(e) {    
    const list = this.getCheckedList();
    const {labelList} = this.props.state;
    Object.keys(labelList).map(key => {
      const labelName = key;      
      let result = 0;
      let count = 0;
      list.map(function(val, i) {
        if( labelList[labelName][2].includes(list[i]) ) {
          result = 1;
          count++;
        }
      });
      if( count === list.length ) {
        result = 2; 
      }
      const target = document.querySelector('.toolBar .chooseFilter li.' + labelName);
      target.classList.remove('chkAll', 'chk');
      switch (result) {
        case 2:
          target.classList.add('chkAll');
          break;
        case 1:
          target.classList.add('chk');
          break;
      }
    })
  }

  render() {
    const {labelList} = this.props.state;
    let style = '';

    Object.keys(labelList).map(key => {
      const labelKey = key;
      const labelName = labelList[labelKey][0];
      const color = labelList[labelKey][1];
      const list = labelList[labelKey][2];
      list.map(function(val, i) {
        style += '.paper' + val + ' h5 .' + labelKey + ' { margin: 0 4px; }';
        style += '.paper' + val + ' h5 .' + labelKey + ':after { content: "' + labelName + '"; }';
      })
    })

    return (
      <div>
        <FilterListCommon name="chooseFilter" onClickBtn={this.handleClickBtn.bind(this)} onClickList={this.handleClickList.bind(this)} />
        <style>{style}</style>
      </div>
    );
  }
});

const Download = connect(mapStateToProps)(class Download extends Component {

  handleClick(e) {
    const JSZip = window.JSZip;          
    const JSZipUtils = window.JSZipUtils;
    const saveAs = window.saveAs;        
    const TSV = window.TSV;

    const zip = new JSZip();
    const dir = zip.folder("paper");

    function deactivateToolbar() {
      document.querySelector('.toolBar').classList.remove('choosing');
    }

    function cancelChecked() {
      const filterChooseAll = document.querySelector('#checkAll');
      filterChooseAll.checked = false;
      const target = document.querySelectorAll('.paper input:checked');
      [].forEach.call(target, function(e) {
        e.checked = false;
      });
    }

    function uniqueArray(array) {
      const uniqueArray = array.filter(function (x, i, self) { return self.indexOf(x) === i; });
      return uniqueArray;
    }

    function getCheckedList() {
      const target = document.querySelectorAll('.paper input:checked');
      const list = [];
      [].forEach.call(target, function(e) {
        list.push(e.id);
      });
      return list;
    }

    function getExtention(e) {
      let ext = e.target.className;
      switch (ext){
        case 'pdftxt':
          ext = 'pdf.txt';
          break;
        case 'annoxlsx':
          ext = 'xlsx';
          break;
        case 'annotsv':
          ext = 'tsv';
          break;
      }
      return ext;
    }

    // function jsonToCsv(data, paperId){
    //   const d = [{
    //       title: data["glossary"]["title"],
    //       ID: data["glossary"]["GlossDiv"]["GlossList"]["GlossEntry"]["ID"],
    //       GlossTerm: data["glossary"]["GlossDiv"]["GlossList"]["GlossEntry"]["GlossTerm"],
    //       Abbrev: data["glossary"]["GlossDiv"]["GlossList"]["GlossEntry"]["Abbrev"]
    //     }, {
    //       title: data["glossary"]["title"],
    //       ID: data["glossary"]["GlossDiv"]["GlossList"]["GlossEntry"]["ID"],
    //       GlossTerm: data["glossary"]["GlossDiv"]["GlossList"]["GlossEntry"]["GlossTerm"],
    //       Abbrev: data["glossary"]["GlossDiv"]["GlossList"]["GlossEntry"]["Abbrev"]
    //     }];
    //   const csv = TSV.CSV.stringify(d);
    //   return csv;
    // }

    // function jsonToXlsx(data, paperId){
    //   const XLSX = window.XLSX;
    //   const dataId = data["glossary"]["GlossDiv"]["GlossList"]["GlossEntry"]["ID"];
    //   const dataTerm = data["glossary"]["GlossDiv"]["GlossList"]["GlossEntry"]["GlossTerm"];
    //   const wb = XLSX.read("", {type:"array"});
    //   const ws = XLSX.utils.json_to_sheet([
    //             { A: "S", B: "h", C: "e", D: "e", E: "t", F: "J", G: dataId }
    //           ], {header: ["A", "B", "C", "D", "E", "F", "G"], skipHeader: true});
    //           XLSX.utils.sheet_add_json(ws, [
    //             { A: 1, B: 2 }, { A: 2, B: 3 }, { A: 3, B: dataTerm }
    //           ], {skipHeader: true, origin: "A2"});
    //           XLSX.utils.sheet_add_json(ws, [
    //             { A: 5, B: 6, C: 7 }, { A: 6, B: 7, C: 8 }, { A: 7, B: 8, C: 9 }
    //           ], {skipHeader: true, origin: { r: 1, c: 4 }, header: [ "A", "B", "C" ]});
    //           XLSX.utils.sheet_add_json(ws, [
    //             { A: 4, B: 5, C: 6, D: 7, E: 8, F: 9, G: 0 }
    //           ], {header: ["A", "B", "C", "D", "E", "F", "G"], skipHeader: true, origin: -1});
    //   const sheetTitle = data["glossary"]["title"];
    //   wb.SheetNames.push(sheetTitle);
    //   wb.Sheets[sheetTitle] = ws;
    //   wb.SheetNames.shift();
    //   return XLSX.write(wb, { bookType:'xlsx', bookSST:false, type:'array' });
    // }

    // function jsonToTsv(data){
    //   const d = [{
    //       title: data["glossary"]["title"],
    //       ID: data["glossary"]["GlossDiv"]["GlossList"]["GlossEntry"]["ID"],
    //       GlossTerm: data["glossary"]["GlossDiv"]["GlossList"]["GlossEntry"]["GlossTerm"]
    //     }, {
    //       title: data["glossary"]["title"],
    //       ID: data["glossary"]["GlossDiv"]["GlossList"]["GlossEntry"]["ID"],
    //       GlossTerm: data["glossary"]["GlossDiv"]["GlossList"]["GlossEntry"]["GlossTerm"]
    //     }];
    //   var tsv = TSV.stringify(d);
    //   return tsv;
    // }

    function tomlToXlsx(data){
      const toml = window.toml;
      const XLSX = window.XLSX;
      const wb = XLSX.read("", {type:"array"});
      const ws = XLSX.utils.json_to_sheet([
                { A: 'Relation', 
                  B: 'Dir', 
                  C: 'Text1', 
                  D: 'Label1', 
                  E: 'Text2', 
                  F: 'Label2', 
                  G: 'Reference' }
              ], {header: ["A", "B", "C", "D", "E", "F", "G"], skipHeader: true});

      let row = 2;
      for (let i = 0; i < data.length; i++) {

        let convert = toml.parse(data[i]['data']);

        for (let key in convert) {
          if (convert.hasOwnProperty(key)) {
            if ( convert[key]['type'] === 'relation' || convert[key]['type'] === undefined ) {
              const id1 = Number(convert[key]['ids'][0]);
              const id2 = Number(convert[key]['ids'][1]);
              const origin = "A" + row;
              XLSX.utils.sheet_add_json(ws, [
                { A: convert[key]['label'], 
                  B: convert[key]['dir'], 
                  C: convert[id1]['text'], 
                  D: convert[id1]['label'], 
                  E: convert[id2]['text'], 
                  F: convert[id2]['label'], 
                  G: data[i]['id'] }
                ],{skipHeader: true, origin: origin});
              
              row++;
            }
          } 
        }
      }
      
      const sheetTitle = 'Paper';
      wb.SheetNames.push(sheetTitle);
      wb.Sheets[sheetTitle] = ws;
      wb.SheetNames.shift();
      
      return XLSX.write(wb, { bookType:'xlsx', bookSST:false, type:'array' });
    }

    function tomlToTsv(data){
      const toml = window.toml;
      const d = [];

      for (let i = 0; i < data.length; i++) {

        let convert = toml.parse(data[i]['data']);

        for (let key in convert) {
          if (convert.hasOwnProperty(key)) {
            if ( convert[key]['type'] === 'relation' || convert[key]['type'] === undefined ) {
              const id1 = Number(convert[key]['ids'][0]);
              const id2 = Number(convert[key]['ids'][1]);
              const obj = {};
                    obj['Relation'] = convert[key]['label'];
                    obj['Dir'] = convert[key]['dir'];
                    obj['Text1'] = convert[id1]['text'];
                    obj['Label1'] = convert[id1]['label'];
                    obj['Text2'] = convert[id2]['text'];
                    obj['Label2'] = convert[id2]['label'];
                    obj['Reference'] = data[i]['id'];
              d.push(obj);
            }
          }
        }

      }

      const tsv = TSV.stringify(d);
      return tsv;
    }

    function downloadZip(){
      zip.generateAsync({type:"blob"})
          .then(function(content) {
              saveAs(content, "paper.zip");
          });
    }

    function downloadBlob(data, ext){

      let type;
      switch (ext) {
        case 'xlsx' :
          type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
          break;
        case 'tsv' :
          type = "text/plain;charset=utf-8";
          break;
        default :
          type = "text/plain;charset=utf-8";
      }

      const blob = new Blob([data], {type: type});
      saveAs(blob, 'paper.' + ext);
    }

    const apiPath = '/api/documents/';

    const ext = getExtention(e);
    if( ext == 'head' || ext.indexOf('close') != -1 ) return false;

    const list = getCheckedList();
    if ( list.length === 0 ) return false; 


    cancelChecked();

    
    let DownloadFlag = new Array(list.length);

    for (let i = 0; i < list.length; i++) {

      const url = apiPath + list[i] + '/' + list[i] + '.' + ( ( ext === 'xlsx' || ext === 'tsv' ) ? 'anno' : ext ) ;

      if ( ext === 'xlsx' || ext === 'tsv' ) {
          window.jQuery.ajax({ type: 'GET', url: url, dataType: 'text'})
          .done(function(data) {
            DownloadFlag[i] = {};
            DownloadFlag[i]['data'] = data;
            DownloadFlag[i]['id'] = list[i];
          })
          .fail(function() {
            DownloadFlag[i] = false;
          });
      } else {
        JSZipUtils.getBinaryContent(url, function (err, data) {
          if(err) {
            DownloadFlag[i] = false;
          } else {            
            dir.file(list[i] + '.' + ext, data, {binary:true});
            DownloadFlag[i] = true;
          }
        });
      }
    }

    
    const id = setInterval( function(){ // wait until all paper downloaded
      let count = 0;

      for (let j = 0; j < DownloadFlag.length; j++) { 
        if( DownloadFlag[j] !== undefined ) count++;
      }

      if( count === DownloadFlag.length ){　

        clearInterval(id);
                
        DownloadFlag = uniqueArray(DownloadFlag);

        if( DownloadFlag.length !== 1 || DownloadFlag[0] !== false) {
          if ( ext === 'xlsx' || ext === 'tsv' ) {
            // const d = ( ext === 'xlsx' ) ? jsonToXlsx(data, list[i]) : jsonToTsv(data); // for JSON
            const d = ( ext === 'xlsx' ) ? tomlToXlsx(DownloadFlag) : tomlToTsv(DownloadFlag); // for TOML
            downloadBlob(d, ext);
          } else {
            downloadZip();  
          }
        }

        deactivateToolbar();
      }
    }, 1000);

  }

  render() {
    const name = 'download';
    const txt = 'Download';
    const headTxt = 'Download all';
    return (
      <div className={'dropdown dropdown--alpha ' + name}>
        <a className='dropdown-button btn z-depth-0' data-beloworigin="true" data-activates={name}>{txt}<i className="material-icons">arrow_drop_down</i></a>
        <ul id={name} className='dropdown-content z-depth-0'>
          <li onClick={this.handleClick.bind(this)} className='head'>{headTxt}<i className="material-icons close">close</i></li>
          <li onClick={this.handleClick.bind(this)} className='pdf'><b>・</b>pdf</li>
          <li onClick={this.handleClick.bind(this)} className='xml'><b>・</b>xml</li>
          <li onClick={this.handleClick.bind(this)} className='pdftxt'><b>・</b>pdf.txt</li>
          <li onClick={this.handleClick.bind(this)} className='annoxlsx'><b>・</b>anno (.xlsx)</li>
          <li onClick={this.handleClick.bind(this)} className='annotsv'><b>・</b>anno (.tsv)</li>
        </ul>
      </div>
    );
  }
});

const CheckAll = connect(mapStateToProps)(class CheckAll extends Component {

  handleChange(e) {
    const filterLabel = document.querySelector('.toolBar');
    const chks = document.querySelectorAll('.paper input[type="checkbox"]');

    for( let i = 0; i < chks.length; i++ ) chks[i].checked = e.target.checked;
            
    ( e.target.checked === true ) ? filterLabel.classList.add('choosing') : filterLabel.classList.remove('choosing');
  }

  render() {
    return (
      <div className="checkAll">
        <input type="checkbox" id="checkAll" className="filled-in" onChange={this.handleChange.bind(this)} />
        <label htmlFor="checkAll"></label>
      </div>
    );
  }
});

const ToolBar = connect(mapStateToProps)(class ToolBar extends Component {  

  render() {
    return (
      <div className="toolBar">

        <CheckAll />
  
        <div className="tools">
          <FilterNormal />
          <FilterChoose />
          <Download />
        </div>

      </div>
    );
  } 
});

class Search extends Component {
  constructor(props) {
    super(props);
    this.searchTimer = null;
    this.articleTitle = null;
    this.author = null;
    this.abstract = null;
  }

  componentWillMount(){
    document.body.classList.add("search");
    this.addTabClassToBody(this.props.state.category);
  }

  componentWillUnmount(){
    document.body.classList.remove("search");
  }

  componentDidMount() {    
    window.jQuery('ul.tabs').tabs();
    window.jQuery('.dropdown-button').dropdown();
    window.jQuery('.modal').modal({ dismissible: false });            
    this.search(this.props.state.category);    
  }
  
  componentDidUpdate(prevProps) {    
    const {category: oldCategory, query: oldQuery, articleTitle: oldArticleTitle, author: oldAuthor, abstract: oldAbstract, gte: oldGte, lte: oldLte, booktitles: oldBooktitles, page: oldPage, labelFilter: oldlabelFilter} = prevProps.state;
    const {category: newCategory, query: newQuery, articleTitle: newArticleTitle, author: newAuthor, abstract: newAbstract, gte: newGte, lte: newLte, booktitles: newBooktitles, page: newPage, labelFilter: newlabelFilter} = this.props.state;
    
    if (oldCategory !== newCategory || oldQuery !== newQuery || oldArticleTitle !== newArticleTitle || oldAuthor !== newAuthor || oldAbstract !== newAbstract || oldPage !== newPage || oldGte !== newGte || oldLte !== newLte || Array.from(oldBooktitles).join("") !== Array.from(newBooktitles).join("") || oldlabelFilter !== newlabelFilter) {
      this.search(newCategory);
    }

    const locationKey = this.props.location.key;
    if (!this.props.state.scrollYPositions.has(locationKey)) {
      return;
    }
    const scrollY = this.props.state.scrollYPositions.get(locationKey);
    this.props.dispatch(deleteScrollY(locationKey));

    window.scrollTo(0, scrollY);
  }

  search(category) {
    switch (category) {
      case "figures":
        this.searchFigures();
        break;
      case "tables":
        this.searchTables();
        break;
      default:
        this.searchPapers();
        break;
    }
  }

  searchPapers() {
    const {query, articleTitle, author, abstract, page, gte, lte, booktitles, labelList, labelFilter} = this.props.state;
    this.props.dispatch(requestPapers(query, articleTitle, author, abstract, page));
    const from = page * this.props.state.papersFetchSize;

    const queryMust = [];
    if (query) {
      queryMust.push(
        {
          bool: {
            should: [
              {
                multi_match: {
                  query,
                  fields: [
                    "id",
                    "articleTitle",
                    "journalTitle",
                    "abstract",
                    "url"
                  ]
                }
              },
              {
                nested: {
                  path: "author",
                  query: {
                    multi_match: {
                      query,
                      fields: [
                        "author.*"
                      ]
                    }
                  }
                }
              }
            ]
          }
        }
      );
    }
    if (articleTitle) {
      queryMust.push({
        match: {articleTitle}
      });
    }
    if (author) {
      queryMust.push({
        nested: {
          path: "author",
          query: {
            multi_match: {
              query: author,
              fields: [
                "author.*"
              ]
            }
          }
        }
      });
    }
    if (abstract) {
      queryMust.push({
        match: {abstract}
      });
    }

    const postFilterMust = [];
    postFilterMust.push({
      range: {
        year: {
          gte,
          lte
        }
      }
    });
    if (booktitles.size > 0) {
      postFilterMust.push({
        terms: {
          "booktitle.keyword": Array.from(booktitles)
        }
      });
    }

    let filterdList = [];
    labelFilter.map(function(e, i) {
      filterdList = filterdList
                      .concat(labelList[e][2])
                      .filter(function (x, i, self) {
                        return self.indexOf(x) === i;
                      });
      if( filterdList.length == 0 ) { filterdList.push("") }; // for empty filter
    })
    const labelFilterList = filterdList.length > 0 ? { terms: { _id: filterdList } } : null;

    const body = JSON.stringify({
      query: {
        bool: {
          must: queryMust
        }
      },
      post_filter: {
        bool: {
          must: postFilterMust,
          filter: labelFilterList
        },
      },
      from,
      size: this.props.state.papersFetchSize,
      highlight: {
        fields: {
          articleTitle: {number_of_fragments: 0},
          journalTitle: {number_of_fragments: 0},
          abstract: {number_of_fragments: 0},
          "author.*": {number_of_fragments: 0}
        }
      },
      aggs: {
        year: {
          histogram: {
            field: "year",
            interval: 1
          }
        },
        booktitle: {
          terms: {
            field: "booktitle.keyword",
            size: 10
          }
        },
      }
    });

    const {user} = this.props.state;
    const token = user ? user.token : null;

    Api.searchPapers({body}, token).then((json) => {
      this.props.dispatch(receivePapers(json));
    });
  }

  searchFigures() {
    const {query, page} = this.props.state;
    this.props.dispatch(requestFigures(query, page));

    const bodyParams = {
      size: this.props.state.figuresFetchSize
    };

    if (query) {
      bodyParams.query = {
        bool: {
          must: {
            nested: {
              path: "caption",
              query: {
                multi_match: {
                  query,
                  fields: [
                    "caption.p",
                    "caption.title"
                  ]
                }
              }
            }
          }
        }
      };
    }

    const body = JSON.stringify(bodyParams);
    Api.searchFigs({body}).then((json) => {
      this.props.dispatch(receiveFigures(json));
    });
  }

  searchTables() {
    const {query, page} = this.props.state;
    this.props.dispatch(requestTables(query, page));

    const from = page * this.props.state.papersFetchSize;

    const bodyParams = {
      from,
      size: this.props.state.tablesFetchSize,
    };

    if (query) {
      bodyParams.query = {
        bool: {
          should: [
            {
              multi_match: {
                query,
                fields: [
                  "articleTitle",
                ]
              }
            },
            {
              nested: {
                path: "caption",
                query: {
                  multi_match: {
                    query,
                    fields: [
                      "caption.p",
                      "caption.title"
                    ]
                  }
                }
              }
            }
          ]
        }
      };
    }

    const body = JSON.stringify(bodyParams);
    Api.searchTables({body}).then((json) => {
      this.props.dispatch(receiveTables(json));
    });
  }

  changeQuery(category, query) {
    if (this.searchTimer !== null) {
      clearTimeout(this.searchTimer);
      this.searchTimer = null;
    }


    this.searchTimer = setTimeout(() => {
      this.props.dispatch(changeQuery(category, query, this.articleTitle, this.author, this.abstract));
    }, 0);
  }

  handleKeyPress(e) {
    if (e.key !== "Enter") {
      return;
    }

    this.changeQuery(this.props.state.category, null);
  }

  handleChangeArticleTitle(e) {
    this.articleTitle = e.target.value;
  }

  handleChangeAuthor(e) {
    this.author = e.target.value;
  }

  handleChangeAbstract(e) {
    this.abstract = e.target.value;
  }

  handleChangeBooktitle(key) {
    this.props.dispatch(changeBooktitle(key));
  }

  handleClickTab(category) {
    this.addTabClassToBody(category);
    this.changeQuery(category, this.props.state.query);    
  }

  addTabClassToBody(category){
    const classList = document.body.classList;
    for (let i = 0; i < classList.length; i++) {
      if( classList[i].split('-')[0] === "tab" ) classList.remove(classList[i]);
    }
    classList.add("tab-"+category);
  }

  render() {
    const {page, papers, papersTotal, papersFetchSize, aggregations, booktitles, figures, figuresTotal, tables, tablesTotal, tablesFetchSize} = this.props.state;

    let year;
    if (aggregations.year.buckets.length > 1) {
      const {gte, lte} = this.props.state;
      const min = aggregations.year.buckets[0].key;
      const max = aggregations.year.buckets[aggregations.year.buckets.length - 1].key;
      year = <PublicationFilter items={aggregations.year.buckets}
                                min={min}
                                max={max}
                                minValue={gte || min}
                                maxValue={lte || max}/>
    }

    let booktitleComponents;
    // if (aggregations.booktitle.buckets.length > 1) {
    //   booktitleComponents = aggregations.booktitle.buckets.map((booktitle, index) => {
    //     const id = `booktitle${index}`;
    //     return (
    //       <li key={id}>
    //         <input id={id} type="checkbox" className="filled-in"
    //                onChange={this.handleChangeBooktitle.bind(this, booktitle.key)}
    //                checked={booktitles.has(booktitle.key)}/>
    //         <label htmlFor={id}>{booktitle.key} ({booktitle.doc_count})</label>
    //       </li>
    //     );
    //   });
    // }

    const categories = [
      "texts",
      "figures",
      "tables"];

    return (
        <div>
          <div className="subNavi z-depth-0">
            <div className="container">
              <div className="row">
                <div className="results col s4 l3">
                  <Switch>
                    <Route path="/figures" component={(props) => (
                        <p><span className="num">{figuresTotal || 0}</span> results</p>
                    )}/>
                    <Route path="/tables" component={(props) => (
                        <p><span className="num">{tablesTotal || 0}</span> results</p>
                    )}/>
                    <Route component={(props) => (
                        <p><span className="num">{papersTotal || 0}</span> results</p>
                    )}/>
                  </Switch>
                </div>

                <div className="col s8 l9">
                  <ul className="tabs tabs--alpha">
                    {categories.map((category) => {
                      let icon;
                      switch (category) {
                        case 'texts'  : icon = 'font_download'; break;
                        case 'figures': icon = 'image';         break;
                        case 'tables' : icon = 'grid_on';       break;
                        default       : icon = '';
                      }

                      return (
                        <li key={category} className="tab" onClick={this.handleClickTab.bind(this, category)}>
                          <a className={this.props.state.category === category ? 'active' : ''}>
                            <span className="txt">
                              <i className="material-icons hide-on-small-only">{icon}</i>
                              {category}
                            </span>
                          </a>
                        </li>
                      );
                    })
                    }
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="row">

            <div className="col s4 l3 sidebar">            
              <div className="col s4 l3">
                <h5><i className="material-icons">find_in_page</i>Filter</h5>
                <div>                

                <Switch>
                  <Route path="/figures" component={(props) => (
                      <div></div>
                  )}/>
                  <Route path="/tables" component={(props) => (
                      <div></div>
                  )}/>
                  <Route component={(props) => (
                    <div>
                      <h6>Article Title</h6>
                      <input className="alpha" type="search" placeholder="enter article title" onKeyPress={this.handleKeyPress.bind(this)} onChange={this.handleChangeArticleTitle.bind(this)}
                             defaultValue={this.props.state.articleTitle}/>
                      <h6>Author</h6>
                      <input className="alpha" type="search" placeholder="enter author" onKeyPress={this.handleKeyPress.bind(this)} onChange={this.handleChangeAuthor.bind(this)}
                             defaultValue={this.props.state.author}/>
                      <h6>Abstract</h6>
                      <input className="alpha" type="search" placeholder="enter abstract" onKeyPress={this.handleKeyPress.bind(this)} onChange={this.handleChangeAbstract.bind(this)}
                             defaultValue={this.props.state.abstract}/>
                    </div>
                  )}/>
                </Switch>

                  <h6>Publication Year</h6>
                  <div className="publication-year">
                    {year}
                  </div>

                  <h6>Booktitle</h6>
                  <ul>
                    {booktitleComponents}
                  </ul>

                </div>
              </div>
            </div>

            <div className="contents col s8 l9">

              <ToolBar/>
              <FilterEdit/>

              <div className="row">

                  <Switch>
                    <Route path="/figures" component={(props) => (
                      <div className="col s12">
                        <Figures data={figures}/>
                      </div>
                    )}/>
                    <Route path="/tables" component={(props) => (
                      <div className="col s12">
                        <Tables data={tables}/>
                        <Paginator total={tablesTotal} size={tablesFetchSize} page={page}/>
                      </div>
                    )}/>
                    <Route component={(props) => (
                      <div className="col s12">
                        <Papers data={papers}/>
                        <Paginator total={papersTotal} size={papersFetchSize} page={page}/>
                      </div>
                    )}/>
                  </Switch>
              </div>
            </div>

          </div>
        </div>
    );
  }
}

export default connect(mapStateToProps)(Search);
