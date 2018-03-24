import React, {Component} from 'react'
import ReactDom from 'react-dom'

class workList extends Component{
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
      <li key={this.props.data.workExternalIdentifierType.value}>
        <div className="work-list-container">
          <h6 class="workspace-title">{this.props.data.title}</h6>
          <dl>
            <dd>{this.props.data.journaltitle}</dd>
            <dd className="small">{this.props.data.publicationDate.year}&ensp;|&ensp;{this.props.data.workType}</dd>
            <dd><span className='title'>DOI:</span>&ensp;
              {this.props.data.workExternalIdentifierHtml.url !== null ? <a href = "{this.props.data.workExternalIdentifierHtml.url}">{this.props.data.workExternalIdentifierHtml.value}</a> :<span>{this.props.data.workExternalIdentifierHtml.value}</span>}
            </dd>
            <dd><span className='title'>EID:</span>&ensp;
            {this.props.data.workExternalIdentifierType.url !== null ? <a href = "{this.props.data.workExternalIdentifierHtml.url}">{this.props.data.workExternalIdentifierType.value}</a> :<span>{this.props.data.workExternalIdentifierType.value}</span>}
            </dd>
          </dl>
          <i className="material-icons" onClick={this.onClick.bind(this)}>{this.state.hide ? "add_circle_outline" : "remove_circle_outline"}</i>
          <div className="toggle">
            <div className={this.state.hide ? "off" : "on"} >
              <div className="worksSrvc_detail">
                <dl>
                  <dt>URL</dt>
                  <dd><a href="{this.props.data.worksSrvc.details.putCode}" target="_blank">{this.props.data.worksSrvc.details.putCode}</a></dd>
                  <dt>Citation<span>(bibtex)</span></dt>
                  <dd>{this.props.data.worksSrvc.details.citation}</dd>
                </dl>
                <div className="row">
                  <div className="col l6 m6 s12">
                    <dl>
                      <dt>Contributor</dt>
                      {this.props.data.worksSrvc.details.Contributors.map((foo)=>{
                        return(
                          <dd>{foo.name}</dd>
                        )
                      })}
                    </dl>
                  </div>  
                  <div className="col l6 m6 s12">
                      <dl>
                        <dt>Created</dt>
                        <dd>{this.props.data.worksSrvc.details.CreatedDate}</dd>
                      </dl>
                  </div>  
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="work-list-footer row m-b-0">
          <div className="col l6 m6 s12">Source: Scopus - Elsevier</div>
          <div className="col l6 m6 s12 text-right">Preferred source</div>
        </div>
      </li>
    )
  }
}

export default workList