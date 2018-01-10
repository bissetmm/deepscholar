import React, {Component} from 'react';
import {
  BrowserRouter, Switch, Route, Link
} from 'react-router-dom';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import Api from '../../api';
import {NavBar} from '../../components/index.js';
import {ScrollToTop} from '../../components/index.js';
import {changeQuery, deleteAllScrollY} from '../../module';
import './style.css';

function mapStateToProps(state) {
  return {state};
}

class Index extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount(){
    document.getElementById("root").classList.add("index");
  }

  componentWillUnmount(){
    document.getElementById("root").classList.remove("index");
  }

  render() {

    return (
      <div className="mainVisual grad">

        <div className="waves">
          <div className="wave wave_1"></div>
          <div className="wave wave_2"></div>
          <div className="wave wave_3"></div>
          <div className="wave wave_4"></div>
          <div className="wave wave_5"></div>
        </div>
        
        <div className="box">

          <h1 className="headline">Dive into a sea of knowledge</h1>

          <div className="row">

            <div className="col s3 l3"></div>

            <div className="col s6 l6">

              <div className="input-field">
                <form>
                  <input type="search" placeholder="Search" />
                </form>
                <label className="label-icon" htmlFor="search"><i className="material-icons">search</i></label>
              </div>

              <div className="try">Try<span className="colon">:</span><Link to="/search">Deep Learning</Link></div>
            </div>

          </div>

        </div>

        <p className="note">DeepScholar is a free , nonprofit search engine.</p>

      </div> 
    );
  }
}

export default connect(mapStateToProps)(Index);
