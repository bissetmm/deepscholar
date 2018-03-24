import React, {Component} from 'react';
import {connect} from 'react-redux';
import './style.css';
import {Tabs, Tab} from 'react-materialize';
import {Pagination} from 'react-materialize';
import {Icon} from 'react-materialize';
import CollapseCard from './collapseCard';
import CollapseCardArray from './collapseCardArray';
import WorkList from './workList';

function mapStateToProps(state) {
  return {state};
}

// Provisional use. Change to appropriate component
const Breadcrumbs = (props) => (
  <div>
    <h5 className="breadcrumbs-title">{props.current}</h5>
    <ol className="breadcrumbs">
    <li><a href="index.html">{props.root} </a></li>
    <li className="active">{props.current}</li>
    </ol>
  </div>
);

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profile:{
        name: 'Hiroyuki Shindo',
        orcid: 'https://orcid.org/0000-0003-1081-9194',
        country: 'Japan',
        keywords:[
          {data:'Natural Language Processing',source:'Hiroyuki Shindo (2018-03-13)'},
          {data:'Machine Learning',source:'Hiroyuki Shindo (2018-03-13)'}],
        website:[
          {data:'http://www.hshindo.com',source:'Hiroyuki Shindo (2018-03-13)'}],
        otherids:[
          {data:'SCOPUS AUTHOR ID: 56567565300',source:'Scopus - Elsevier (2018-03-09)'}],
        source:'Hiroyuki Shindo (2018-03-13)'
      },
      work:[
       {title:'Neural modeling of multi-predicate interactions for Japanese predicate argument structure analysis',
        journaltitle:'ACL 2017 - 55th Annual Meeting of the Association for Computational Linguistics, Proceedings of the Conference (Long Papers)',
        publicationDate:{
          year:'2017',
          month:null,
          day:null
        },
        workType:'conference-paper',
        workExternalIdentifierHtml:{value:'10.18653/v1/P17-1146',url:'https://doi.org/10.18653/v1/P17-1146'},
        workExternalIdentifierType:{value:'2-s2.0-85040945840',url:null},
        worksSrvc:{
          details:{
            putCode:'http://www.scopus.com/inward/record.url?eid=2-s2.0-85040945840&partnerID=MN8TOARS',
            citation:'@article{Shindo2017,title = {Neural modeling of multi-predicate interactions for Japanese predicate argument structure analysis},journal = {ACL 2017 - 55th Annual Meeting of the Association for Computational Linguistics, Proceedings of the Conference (Long Papers)},year = {2017},volume = {1},pages = {1591-1600},author = {Ouchi, H. and Shindo, H. and Matsumoto, Y.}}',
            Contributors:[
              {name:'Ouchi, H.'},{name:'Shindo, H.'},{name:'Matsumoto, Y.'}
            ],
            CreatedDate:'2018-03-09'
          }
        }
        },
        {title:'Generating artificial error data for indonesian preposition error corrections',
        journaltitle:'International Journal of Technology',
        publicationDate:{
          year:'2017',
          month:null,
          day:null
        },
        workType:'journal-article',
        workExternalIdentifierHtml:{value:'10.14716/ijtech.v8i3.4825',url:'https://doi.org/10.14716/ijtech.v8i3.4825'},
        workExternalIdentifierType:{value:'2-s2.0-85018424419',url:null},
        worksSrvc:{
          details:{
             putCode:'http://www.scopus.com/inward/record.url?eid=2-s2.0-85018424419&partnerID=MN8TOARS',
             citation:'@article{Shindo2017,title = {Generating artificial error data for indonesian preposition error corrections},journal = {International Journal of Technology},year = {2017},volume = {8},number = {3},pages = {549-558},author = {Irmawati, B. and Shindo, H. and Matsumoto, Y.}}',
             Contributors:[
               {name:'Irmawati, B.'},{name:'Shindo, H.'},{name:'Matsumoto, Y.'}
             ],
             CreatedDate:'2018-03-09'
          }
        }
      }
    ],
    education:[{
        affiliation:{
          name:'Nara Institute of Science and Technology',
          city:'Ikoma',
          region:'Nara',
          countoryForDisplay:'Japan',
          startDate:{
            year:'2012',
            month:'10',
            day:'01'
          },
          endDate:{
            year:'2013',
            month:'09',
            day:'30'
          },
          roletitle:null,
          departmentName:null,
          OrganizationIdentifiers:{
            grid:{value:'grid.260493.a',url:'https://www.grid.ac/institutes/grid.260493.a'},
            orgDisambiguatedName:'Nara Institute of Science and Technology',
            orgDisambiguatedUrl:{value:'Http://www.naist.jp/en/',URL:'Http://www.naist.jp/en/'},
            othergrid:{
              isni:'0000 0000 9227 2257',
              orgred:'15696064',
              wikidata:'Q843253',
              wikipedia_url:[{url:'https://en.wikipedia.org/wiki/Nara_Institute_of_Science_and_Technology (preferred)'},{url:'https://en.wikipedia.org/wiki/Nara_Institute_of_Science_and_Technology'}]
            }
          },
          createDate:{
            year:'2018',
            month:'03',
            day:'09'
          },
          source:'Hiroyuki Shindo'
        }
      },
      ],
      employment:[{
        affiliation:{
          name:'Nara Institute of Science and Technology',
          city:'Ikoma',
          region:'Nara',
          countoryForDisplay:'Japan',
          startDate:{
            year:'2014',
            month:'04',
            day:'01'
          },
          endDate:{
            year:'present',
            month:null,
            day:null
          },
          roletitle:null,
          departmentName:null,
          OrganizationIdentifiers:{
            grid:{value:'grid.260493.a',url:'https://www.grid.ac/institutes/grid.260493.a'},
            orgDisambiguatedName:'Nara Institute of Science and Technology',
            orgDisambiguatedUrl:{value:'Http://www.naist.jp/en/',URL:'Http://www.naist.jp/en/'},
            othergrid:{
              isni:'0000 0000 9227 2257',
              orgred:'15696064',
              wikidata:'Q843253',
              wikipedia_url:[{url:'https://en.wikipedia.org/wiki/Nara_Institute_of_Science_and_Technology (preferred)'},{url:'https://en.wikipedia.org/wiki/Nara_Institute_of_Science_and_Technology'}]
            }
          },
          createDate:{
            year:'2018',
            month:'03',
            day:'09'
          },
          source:'Hiroyuki Shindo'
        }
      },
      ]
    }
  }

  render() {
    const user_initial = this.state.profile.name.slice(0,1)

    return(
      <div className="page-wrapper m-t--36">
        <div className="container-field">
          <div className="row page-titles">
            <div className="col s12 m12 l12">
              <Breadcrumbs current={'Profile'} root={'home'}/>
            </div>
          </div>

          <div className="row">
            <div className="col l4 m4 s5">
              <div className="card">
                <div className="card-body">
                  <div className="card-content m-t-30">
                    <div className="center">
                      <div className="user_bg">
                        <img src="/images/user_bg.png" className="img-circle" width="150"/>
                        <div className="initial_flort">{user_initial}</div>
                      </div>
                      <h4 id="public-fullname" className="m-t-10">{this.state.profile.name}</h4>
                    </div>
                    <div className="card-subtitle">ORCID ID</div>
                    <h6 className="orcid-number"><a href={this.state.profile.orcid} target="_blank">{this.state.profile.orcid}</a></h6>
                  </div>
                  <div>
                  <CollapseCard title={"Country"} data={this.state.profile.country} source={this.state.profile.source} href={false}/>  
                  <CollapseCardArray title={'Keyword'} data={this.state.profile.keywords} source={this.state.profile.source} href={false}/>
                  <CollapseCardArray title={"Website"} data={this.state.profile.website} source={this.state.profile.source} href={true}/>
                  <CollapseCardArray title={"Otherids"} data={this.state.profile.otherids} source={this.state.profile.source} href={true}/>
                  </div>
                </div>
              </div>
            </div>

            <div className="col l8 m8 s5">
              <div className="card">
                <Tabs className='tab-demo z-depth-1'>
                  <Tab title="Works" active>
                    <div className="card-body">
                    <ul id="work-list">
                    {this.state.work.map((item)=>{
                      return(
                        <WorkList data={item}/>
                      )
                    })}
                    </ul>
                    <Pagination items={10} activePage={2} maxButtons={8} />
                    </div>
                  </Tab>

                  <Tab title="Education">
                    <div className="card-body">
                      <h6>Education</h6>
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