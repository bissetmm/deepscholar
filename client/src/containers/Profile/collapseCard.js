import React, {Component} from 'react';
import ReactDom from 'react-dom';


class collapseCard extends Component{
  constructor(props){
    super(props)
    this.state = {
      hover:false,
      hide:true
    }
  }

  onClick(){
    this.setState({
      hide:!this.state.hide
    })
  }

  render(){
    console.log(Object.prototype.toString.call(this.props.data) === "[object Array]");

    let flg = Object.prototype.toString.call(this.props.data) === "[object Array]";

    const result = flg ? this.props.data.map((list) => <span>{list.val}<br/>{list.source}</span>) : ''
    // Object.prototype.toString.call(this.props.data) === "[object Array]"?
    //   this.props.data.map((list) => 
    //     <span>{list}</span> :      <span>{this.props.data}</span>
    

    return(
      <div className="card-action">
        <div className="card-subtitle">{this.props.title}</div>
        <i className="material-icons" onClick={this.onClick.bind(this)}>{this.state.hide ? "add_circle_outline" : "remove_circle_outline"}</i>
        <div className="public-content">

          {/* <span>{this.props.data}</span> */}
          {/* {(() => {
            if (this.props.data)
          })} */}
          {result}
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