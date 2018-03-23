import React, {Component} from 'react';
import {connect} from 'react-redux';
import './style.css';
import {Tabs, Tab} from 'react-materialize';
import {Pagination} from 'react-materialize';
import {Icon} from 'react-materialize';

import {Collapse} from 'react-collapse';
import {presets} from 'react-motion';

function mapStateToProps(state) {
  return {state};
}




const Breadcrumbs = (props) => (
  <div>
    <h5 className="breadcrumbs-title">Profile</h5>
    <ol className="breadcrumbs">
    <li><a href="index.html">Home </a></li>
      <li className="active">Profile</li>
    </ol>
  </div>
);

const text = [
  "You think water moves fast? You should see ice. It moves like it has a mind. Like it knows it killed the world once and got a taste for murder. After the avalanche, it took us a week to climb out. Now, I don't know exactly when we turned on each other, but I know that seven of us survived the slide... and only five made it out. Now we took an oath, that I'm breaking now. We said we'd say it was the snow that killed the other two, but it wasn't. Nature is lethal but it doesn't hold a candle to man.",
  "Your bones don't break, mine do. That's clear. Your cells react to bacteria and viruses differently than mine. You don't get sick, I do. That's also clear. But for some reason, you and I react the exact same way to water. We swallow it too fast, we choke. We get some in our lungs, we drown. However unreal it may seem, we are connected, you and I. We're on the same curve, just on opposite ends.",
  "Do you see any Teletubbies in here? Do you see a slender plastic tag clipped to my shirt with my name printed on it? Do you see a little Asian child with a blank expression on his face sitting outside on a mechanical helicopter that shakes when you put quarters in it? No? Well, that's what you see at a toy store. And you must think you're in a toy store, because you're here shopping for an infant named Jeb.",
  "You see? It's curious. Ted did figure it out - time travel. And when we get back, we gonna tell everyone. How it's possible, how it's done, what the dangers are. But then why fifty years in the future when the spacecraft encounters a black hole does the computer call it an 'unknown entry event'? Why don't they know? If they don't know, that means we never told anyone. And if we never told anyone it means we never made it back. Hence we die down here. Just as a matter of deductive logic."
];

const getText = num => text.slice(0, num).map((p, i) => <p key={i}>{p}</p>);

const data = [
  {
    name: 'Hiroyuki Shindo',
    orcid: 'https://orcid.org/0000-0003-1081-9194',
    country: 'Japan',
    Keywords:[{keyword:'Natural Language Processing'},{keyword:'Machine Learning'}],
    website:'HTTP://WWW.HSHINDO.COM',
    otherids:'SCOPUS AUTHOR ID: 56567565300'    
  }
]



class Profile extends React.Component {

  constructor(props) {
    super(props);
    //this.state = {isOpened: this.props.isOpened, paragraphs: 4};
    this.data = data[0];
  }

  render() {

    

    return(
      <div className="page-wrapper m-t--36">
        <div className="container-field">
          <div className="row page-titles">
            <div className="col s12 m12 l12">
              <Breadcrumbs/>
            </div>
          </div>

          <div className="row">
            <div className="col l4 m4 s5">
              <div className="card">
                <div className="card-body">
                  <div className="card-content m-t-30">
                    <div className="center">
                      <img src="/images/user_bg.png" className="img-circle" width="150"/>
                      <h4 id="public-fullname" className="m-t-10">{this.data.name}</h4>
                    </div>
                    <div className="card-subtitle">ORCID ID</div>
                    <h6 className="orcid-number">{this.data.orcid}</h6>
                  </div>
                  {/* workspace-section */}
                  <div className="card-action">
                    {/* ul.workspace-section-heading */}
                    <div className="card-subtitle">Country</div>
                    <Icon>remove_circle_outline</Icon>
                    <div id="public-country-div" className="public-content">
                      <span name="country">Japan</span>
                      <div className="source-line separator">
                      <p>Sources:<br/>Hiroyuki Shindo (2018-03-13)</p>
                      </div>
                    </div>
                  </div>
                  {/* workspace-section */}
                  <div className="card-action">
                    <div className="card-subtitle">Keywords</div>
                    <Icon>remove_circle_outline</Icon>
                    <div id="public-keyword-div" className="public-content">
                      <span name="keyword">Natural Language Processing</span>
                      <div className="source-line separator">
                      <p>Sources:<br/>Hiroyuki Shindo (2018-03-13)</p>
                      </div>
                      <span name="keyword">Machine Learning</span>
                      <div className="source-line separator">
                      <p>Sources:<br/>Hiroyuki Shindo (2018-03-13)</p>
                      </div>
                    </div>
                  </div>
                  {/* workspace-section */}
                  <div className="card-action">
                    <div className="card-subtitle">Websites</div>
                    <Icon>remove_circle_outline</Icon>
                    <div id="public-researcher-urls-div" class="public-content">
                      <a href="http://www.hshindo.com" target="researcherUrl.urlName" rel="me nofollow">http://www.hshindo.com</a>
                      <div class="source-line separator">
                      <p>Sources:<br/>Hiroyuki Shindo (2018-03-13)</p>
                      </div>
                    </div>
                  </div>
                  {/* workspace-section */}
                  <div className="card-action">
                    <div className="card-subtitle">Other IDs</div>
                    <Icon>remove_circle_outline</Icon>
                    <div id="public-external-identifiers-div" class="public-content">
                    <a href="http://www.scopus.com/inward/authorDetails.url?authorID=56567565300&amp;partnerID=MN8TOARS" target="externalIdentifier.value">Scopus Author ID: 56567565300</a>
                    <div class="source-line separator">
                    <p>Sources:<br/>Scopus - Elsevier (2018-03-09)</p>
                    </div>
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>

            <div className="col l8 m8 s5">
              <div className="card">
                
              <Tabs className='tab-demo z-depth-1'>
                  <Tab title="Works" active>
                    <div className="card-body">
                      <div className="card-content m-t-30">
                        
                      </div>

                      <div className="card-content m-t-30">
                        
                      </div>

                      
                      <div className="card-content m-t-30">
                        <ul id="body-work-list">
                          <li>
                            <div className="work-list-container">
                              <ul className="source-edit-list">
                                <li>
                                  <h6 class="workspace-title">
                                  <span ng-bind="work.title.value">Neural modeling of multi-predicate interactions for Japanese predicate argument structure analysis</span>
                                  <span class="journaltitle" ng-bind="work.journalTitle.value">ACL 2017 - 55th Annual Meeting of the Association for Computational Linguistics, Proceedings of the Conference (Long Papers)</span>
                                  </h6>
                                  <div class="info-detail">
                                  <span ng-bind="work.publicationDate.year" class="ng-binding ng-scope">2017</span>
                                  <span class="capitalize ng-binding" ng-bind="work.workType.value">conference-paper</span>
                                  </div>

                                  <ul>
                                    <li>
                                    <span class="type ng-scope">DOI</span>: <a href="https://doi.org/10.18653/v1/P17-1146" class="ng-scope" target="orcid.blank">10.18653/v1/P17-1146</a>
                                    </li>
                                    <li>
                                    <span class="type ng-scope">EID</span>: 2-s2.0-85040945840
                                    </li>
                                  </ul>


                                  <div class="more-info ng-scope">
                                    <div class="content">
                                      <span class="dotted-bar"></span>
                                      <div class="row">
                                        <div class="col-md-6 ng-scope">
                                          <div class="bottomBuffer">
                                            <strong>
                                            URL </strong>
                                          </div>
                                          <div>
                                            <a href="#">http://www.scopus.com/inward/record.url?eid=2-s2.0-85040945840&amp;partnerID=MN8TOARS</a>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div class="row bottomBuffer ng-scope">
                                      <div class="col-md-12">
                                        <strong>Citation</strong> <span> (<span class="ng-scope"><i class="ng-binding">bibtex</i></span>)
                                        </span>
                                        <span  class="ng-scope">
                                        <a class="toggle-tag-option"></a>
                                        </span>
                                      </div>
                                      <div class="col-md-12">
                                        <div class="col-md-offset-1 col-md-11 col-sm-offset-1 col-sm-11 col-xs-12 citation-raw ng-binding ng-scope">
                                          
                                        </div>
                                      </div>
                                    </div>

                                    <div class="row bottomBuffer">
                                      <div class="col-md-6 ng-scope">
                                        <div class="bottomBuffer">
                                        <strong> Contributor </strong>
                                          <div class="ng-binding ng-scope">Ouchi, H. <span class="ng-binding"></span>
                                          </div>
                                          <div class="ng-binding ng-scope">Shindo, H. <span class="ng-binding"></span>
                                          </div>
                                          <div class="ng-binding ng-scope">Matsumoto, Y. <span class="ng-binding"></span>
                                          </div>
                                        </div>
                                      </div>
                                      <div class="col-md-6">
                                        <div class="bottomBuffer">
                                          <strong>Created</strong><br/>
                                          <div class="ng-binding">2018-03-09</div>
                                        </div>
                                      </div>
                                      <div class="col-md-12">
                                        <div class="bottomBuffer">
                                          <div class="badge-container-42442820">
                                          
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              </ul>
                            </div>
                          </li>
                        </ul>
                      </div>
                      <Pagination items={10} activePage={2} maxButtons={8} />
                      </div>
                    </Tab>

                    <Tab title="Education">
                      <div className="card-body">
                      Education
                      </div>
                    </Tab>
                  </Tabs>
                
              </div>
            </div>
          </div>
        </div>
      </div>
      
    )
  }
}

export default connect(mapStateToProps)(Profile);