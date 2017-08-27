import React, {Component} from 'react';
import {Document} from '../../components/index';
import {connect} from 'react-redux';
import Api from '../../api';
import {requestDocument, receiveDocument} from '../../module';
import './style.css';

class Detail extends Component {
  componentDidMount() {
    this.search(this.props.match.params.documentId);
  }

  search(documentId) {
    this.props.dispatch(requestDocument(documentId));
    Api.search(`q=id:"${documentId}"`)
      .then((json) => {
        this.props.dispatch(receiveDocument(json));
      });
  }

  render() {
    const {document} = this.props.state;

    return (
      <div className="row">
        <div className="col s12">
          {this.props.history.length > 2 &&
          <a className="back-to-results" href="javascript:void(0)" onClick={this.props.history.goBack}>Back to
            results</a>
          }
          {document !== null &&
          <Document data={document} isForceFullText={true}/>
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
