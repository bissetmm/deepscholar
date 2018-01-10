import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import Api from '../../api';
import './style.css';

function mapStateToProps(state) {
  return {state};
}

class Index extends Component {

  render() {
    return (
      <div>Index</div>
    );
  }
}

export default connect(mapStateToProps)(Index);
