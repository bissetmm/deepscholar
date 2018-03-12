import React, {Component} from 'react';
import {connect} from 'react-redux';
import { changeQuery } from '../../module';
import './style.css';

function mapStateToProps(state) {
  return {state};
}

class Index extends Component {

  constructor(props) {
    super(props);
    this.searchTimer = null;
    this.query = null;
  }

  componentWillMount(){
    document.body.classList.add("index");
  }

  componentWillUnmount(){
    document.body.classList.remove("index");
  }

  handleSubmit(e) {
    e.preventDefault();

    this.props.dispatch(changeQuery("texts", this.query, null, null, null, []));

    if( this.query === this.props.state.query && this.props.state.page === 0 ) { 
      // In case, back to top page from search page & search same word(s). Otherwise, search was not detected.
      const q = ( this.query === null ) ? "?page=1" : "?q=" + this.query + "&page=1";
      this.props.history.push("/texts" + q);
    }

  }

  handleChange(e) {
    this.query = e.target.value;
  }

  handleClick(e) {
    this.query = encodeURIComponent(e.target.innerText);
    this.handleSubmit(e)
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

            <div className="col s2 l3"></div>

            <div className="col s8 l6">

              <div className="input-field input-field--search noBorder">
                <form onSubmit={this.handleSubmit.bind(this)}>
                  <input type="search" placeholder="Search" onChange={this.handleChange.bind(this)} />
                </form>
                <label className="label-icon" htmlFor="search"><i className="material-icons">search</i></label>
              </div>

              <div className="try">Try<span className="colon">:</span><a href="#" onClick={this.handleClick.bind(this)}>Deep Learning</a></div>
            </div>

          </div>

        </div>

        <p className="note">DeepScholar is a free search engine for scientific papers.</p>


      </div> 
    );
  }
}

export default connect(mapStateToProps)(Index);
