import React, {Component} from 'react';
import {Paper} from '../../components/index.js';
import {connect} from 'react-redux';
import Api from '../../api';
import {requestPaper, receivePaper} from '../../module';
import './style.css';

class Detail extends Component {
  componentDidMount() {
    this.search(this.props.match.params.paperId);
  }

  search(paperId) {
    this.props.dispatch(requestPaper(paperId));
    const body = JSON.stringify({
      query: {
        match: {
          id: paperId
        }
      }
    });
    Api.searchPapers({body}).then((json) => {
      this.props.dispatch(receivePaper(json));
    });
  }

  render() {
    const {paper} = this.props.state;

    return (
      <div className="row">
        <div className="col s12">
          {this.props.history.length > 2 &&
          <a className="back-to-results" href="javascript:void(0)" onClick={this.props.history.goBack}><i className="material-icons">keyboard_arrow_left</i>Back to
            results</a>
          }
          {paper !== null &&
          <Paper data={paper} asFull={true}/>
          }
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {state};
}

export default connect(mapStateToProps)(Detail);
