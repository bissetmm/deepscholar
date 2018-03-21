import React, {Component} from 'react';
import {connect} from 'react-redux';
import './style.css';
import {Tabs, Tab} from 'react-materialize';
import {Pagination} from 'react-materialize';
import {Icon} from 'react-materialize';

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

const data = [
  {name: 'HIroyuki Shindo',orcid: 'https://orcid.org/0000-0003-1081-9194'}
]

class Profile extends React.Component {
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
                      <h4 className="m-t-10">Hiroyuki Shindo</h4>
                    </div>
                    <div className="card-subtitle">ORCID ID</div>
                    <h6 className="orcid-number">https://orcid.org/0000-0003-1081-9194</h6>
                  </div>
                  {/* workspace-section */}
                  <div className="card-action">
                    {/* ul.workspace-section-heading */}
                    <div className="card-subtitle">Country</div>
                    <div id="public-country-div" className="public-content">
                      <span name="country">Japan</span>
                    </div>
                  </div>
                  {/* workspace-section */}
                  <div className="card-action">
                    <div className="card-subtitle">Keywords</div>
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
                          <ul id="body-work-list">
                            <li>
                              <div className="work-list-container">
                                <ul className="source-edit-list">
                                  <li>
                                    <h6 class="workspace-title">
                                    <span ng-bind="work.title.value" class="ng-binding">Neural modeling of multi-predicate interactions for Japanese predicate argument structure analysis</span>
                                    <span class="journaltitle ng-binding ng-scope" ng-bind="work.journalTitle.value">ACL 2017 - 55th Annual Meeting of the Association for Computational Linguistics, Proceedings of the Conference (Long Papers)</span>
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