import React, {Component} from 'react'
import ReactDom from 'react-dom'

class educationList extends Comment{
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
      <div></div>
    )
  }
}

export default educationList