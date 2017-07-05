import React, {Component} from 'react';
import './App.css';
import {
  Row,
  Navbar,
  Collapsible,
  CollapsibleItem,
  Input,
  Chip,
  Col,
  Collection,
  CollectionItem
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
    this.state = {documents: []};
  }

  componentDidMount() {
    fetch("api/search", {accept: "application/json"})
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response;
        }
      })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        this.setState({documents: json});
      })
  }

  render() {
    return (
      <Row>
        <Navbar brand="Deep Scholar" className={"light-blue"}>

        </Navbar>
        <Col s={3}>
          <Collapsible>
            <CollapsibleItem header={"Filter Group 1"} node={"div"} icon={"insert_chart"} expanded={true}>
              <Row>
                <Input type="checkbox" value="1" label="Filter 1"></Input>
                <Input type="checkbox" value="2" label="Filter 2"></Input>
                <Input type="checkbox" value="3" label="Filter 3"></Input>
              </Row>
            </CollapsibleItem>
            <CollapsibleItem header="Filter Group 2" node={"div"} icon="insert_chart" expanded={true}>
              <Row>
                <Input type="checkbox" value="1" label="Filter 1"></Input>
                <Input type="checkbox" value="2" label="Filter 2"></Input>
                <Input type="checkbox" value="3" label="Filter 3"></Input>
              </Row>
            </CollapsibleItem>
          </Collapsible>
        </Col>

        <Col s={9}>
          <Documents data={this.state.documents}/>
        </Col>
      </Row>
    );
  }
}

export default App;
