import React, {Component} from 'react';
import {Document} from '../common';
import Api from '../../api';
import './style.css';

class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {document: null};
  }

  componentDidMount() {
    this.search(this.props.match.params.documentId);
  }

  search(documentId) {
    Api.search(`q=id:"${documentId}"`)
      .then((json) => {
        this.setState({
          document: json.hits.hits.map((item) => item._source)[0]
        });
      });
  }

  render() {
    return (
      <div className="row">
        <div className="col s12">
          {this.props.history.length > 2 &&
          <a className="back-to-results" href="javascript:void(0)" onClick={this.props.history.goBack}>Back to
            results</a>
          }
          {this.state.document !== null &&
          <Document data={this.state.document} key={this.state.document.id} isTruncate={false}/>
          }
        </div>
      </div>
    );
  }
}

export default Detail;
