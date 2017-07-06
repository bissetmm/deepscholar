import React, {Component} from 'react';
import './App.css';
import {
  Row,
  Navbar,
  Input,
  Chip,
  Col,
  Collection,
  CollectionItem,
  Icon
} from 'react-materialize';


class Document extends Component {
  render() {
    const booktitle = this.props.data.booktitle;
    const author = this.props.data.author;
    const year = this.props.data.year;
    const id = this.props.data.id;
    const abstract = this.props.data.abstract;

    return (
      <CollectionItem>
        <h3>{booktitle}</h3>
        <Chip>{author}</Chip>
        <Chip>{year}</Chip>
        <Chip>{id}</Chip>
        <p>{abstract}</p>
      </CollectionItem>
    );
  }
}

class Documents extends Component {
  render() {
    const documents = this.props.data.map((document) => {
      return <Document data={document} key={document.id}/>;
    });

    return (
      <Collection>
        {documents}
      </Collection>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.searchTimer = null;
    this.state = {documents: []};
  }

  handleTextChange(e) {
    if (this.searchTimer !== null) {
      clearTimeout(this.searchTimer);
      this.searchTimer = null;
    }

    const query = e.target.value;
    if (!query) {
      return;
    }

    this.searchTimer = setTimeout(() => {
      fetch(`api/search?q=${query}`, {accept: "application/json"})
        .then((response) => {
          if (response.status >= 200 && response.status < 300) {
            return response;
          }
        })
        .then((response) => {
          return response.json();
        })
        .then((json) => {
          console.log(json);
          this.setState({documents: json});
        });
    }, 1000);
  }

  render() {
    return (
      <Row>
        <Navbar brand="Deep Scholar" className={"light-blue"}>
        </Navbar>
        <Col s={3}>
          <Row>
            <Input s={50} placeholder="booktitle:Test" label="Query" validate
                   onChange={this.handleTextChange.bind(this)}>
              <Icon>search</Icon>
            </Input>
          </Row>
        </Col>

        <Col s={9}>
          <Documents data={this.state.documents}/>
        </Col>
      </Row>
    );
  }
}

export default App;
