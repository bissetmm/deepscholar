import React, {Component} from 'react';
import ReactDom from 'react-dom';


class collapseCardArray extends Component{
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
          {this.props.data.map((item)=>{
            return(
              <div className={this.state.hide ? "" : "top"}>
                {this.props.href ? <span><a href="{item.data}" target="_brank">{item.data}</a></span> : <span>{item.data}</span>}
                <div className="toggle">
                <div className={this.state.hide ? "off" : "on"} >
                  <p>Sources:<br/>{item.source}</p>
                </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

export default collapseCardArray;