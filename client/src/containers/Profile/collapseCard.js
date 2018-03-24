import React, {Component} from 'react';
import ReactDom from 'react-dom';

class collapseCard extends Component{
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
      <div className="card-action">
        <div className="card-subtitle">{this.props.title}</div>
        <i className="material-icons" onClick={this.onClick.bind(this)}>{this.state.hide ? "add_circle_outline" : "remove_circle_outline"}</i>
        <div className="public-content">
          {this.props.href ? <span><a href="{this.props.data}" target="_brank">{this.props.data}</a></span> : <span>{this.props.data}</span>}
          <div className="toggle">
            <div className={this.state.hide ? "off" : "on"} >
              <p>Sources:<br/>{this.props.source}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default collapseCard;