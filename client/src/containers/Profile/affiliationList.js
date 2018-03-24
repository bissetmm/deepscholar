import React, {Component} from 'react'
import ReactDom from 'react-dom'

class affiliationList extends Component{
  constructor(props){
    super(props)
    this.state = {
      hide:true
    }
  }

  onClick(){
    this.setState({
      hide:!this.state.hide
    })
  }

  render(){
    return(
      <div className="work-list-container m-b-30">
        <ul>
          <li className="type">{this.props.data.type}</li>
          <li className="date">{this.props.data.startDate.year}/{this.props.data.startDate.month}/{this.props.data.startDate.day} - {this.props.data.endDate.year}/{this.props.data.endDate.month}/{this.props.data.endDate.day}</li>
          <li className="affiliation uppercase">
              <a>
                {this.props.data.name}:{this.props.data.city},{this.props.data.region},{this.props.data.countoryForDisplay}
              </a>
          </li>
          <li className="position">{this.props.data.roletitle} {this.props.data.departmentName}</li>
        </ul> 
        <i className="material-icons" onClick={this.onClick.bind(this)}>{this.state.hide ? "add_circle_outline" : "remove_circle_outline"}</i>
        <div className="toggle">
          <div className={this.state.hide ? "off" : "on"} >
            <div className="worksSrvc_detail">
            <dl>
              <dt className="title">Organization identifiers</dt>
              <dd><span>GRID : </span>{this.props.data.identifer.grid.value}</dd>
              <dd>{this.props.data.identifer.orgDisambiguatedName}</dd>
              <dd>{this.props.data.identifer.orgDisambiguatedUrl.value}</dd>
              <dt>Other organization identifiers provided by GRID</dt>
              <dd><span>ISNI : </span>{this.props.data.identifer.grid.value}</dd>
              <dd><span>ORGREF : </span>{this.props.data.identifer.grid.value}</dd>
              <dd><span>WIKIDATA : </span>{this.props.data.identifer.grid.value}</dd>
              <dd><span>WIKIPEDIA_URL : </span>{this.props.data.identifer.othergrid.wikipedia_url.map((item)=>{
                return(
                  <span>{item.url}&nbsp;</span>
                )
              })}</dd>
              <dt>Created</dt>
              <dd>{this.props.data.createDate.year}/{this.props.data.createDate.month}/{this.props.data.createDate.day}</dd>
            </dl>
            </div>
          </div>
        </div>
        <div className="work-list-footer row m-b-0">
          <div className="col l6 m6 s12">Source: {this.props.data.source}</div>
          
        </div>  
      </div>
    )
  }
}

export default affiliationList