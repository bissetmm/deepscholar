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


class App extends Component {
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
          <Collection>
            <CollectionItem>
              <h3>Sixth Applied Natural Language Processing Conference</h3>
              <Chip>Jonsson, Arne and Dahlback, Nils</Chip>
              <Chip>2000</Chip>
              <Chip>A00-1007</Chip>
              <p>e report on a method for utilising corpora collected in natural settings. It is based on
                distilling(re-writing) natural dialogues to elicit the type of dialogue that would occur if one the
                dialogue participants was a computer instead of a human. The method is a complement to other means such
                as Wizard of Oz-studies and un-distilled natural dialogues. We present the distilling method and
                guidelines for distillation. We also illustrate how the method affects a corpus of dialogues and discuss
                the pros and cons of three approaches in different phases of dialogue systems development</p>
            </CollectionItem>
            <CollectionItem>
              <h3>Sixth Applied Natural Language Processing Conference</h3>
              <Chip>Jonsson, Arne and Dahlback, Nils</Chip>
              <Chip>2000</Chip>
              <Chip>A00-1007</Chip>
              <p>e report on a method for utilising corpora collected in natural settings. It is based on
                distilling(re-writing) natural dialogues to elicit the type of dialogue that would occur if one the
                dialogue participants was a computer instead of a human. The method is a complement to other means such
                as Wizard of Oz-studies and un-distilled natural dialogues. We present the distilling method and
                guidelines for distillation. We also illustrate how the method affects a corpus of dialogues and discuss
                the pros and cons of three approaches in different phases of dialogue systems development</p>
            </CollectionItem>
            <CollectionItem>
              <h3>Sixth Applied Natural Language Processing Conference</h3>
              <Chip>Jonsson, Arne and Dahlback, Nils</Chip>
              <Chip>2000</Chip>
              <Chip>A00-1007</Chip>
              <p>e report on a method for utilising corpora collected in natural settings. It is based on
                distilling(re-writing) natural dialogues to elicit the type of dialogue that would occur if one the
                dialogue participants was a computer instead of a human. The method is a complement to other means such
                as Wizard of Oz-studies and un-distilled natural dialogues. We present the distilling method and
                guidelines for distillation. We also illustrate how the method affects a corpus of dialogues and discuss
                the pros and cons of three approaches in different phases of dialogue systems development</p>
            </CollectionItem>
          </Collection>
        </Col>
      </Row>
    );
  }
}

export default App;
