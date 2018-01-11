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

    if( this.query == this.props.state.query && this.props.state.page == 0) { // 検索ページから戻り、同じ文字列を検索する場合、遷移がトリガーしない為、ここで強制遷移（検索はしないで前回の画面をそのまま表示）
      this.props.history.push("/search?q=" + this.query + "&page=1");
      return false;
    }

    if (this.searchTimer !== null) {
      clearTimeout(this.searchTimer);
      this.searchTimer = null;
    }

    this.searchTimer = setTimeout(() => {
      this.props.dispatch(changeQuery(this.query));
    }, 0);
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

            <div className="col s3 l3"></div>

            <div className="col s6 l6">

              <div className="input-field">
                <form onSubmit={this.handleSubmit.bind(this)}>
                  <input type="search" placeholder="Search" onChange={this.handleChange.bind(this)} />
                </form>
                <label className="label-icon" htmlFor="search"><i className="material-icons">search</i></label>
              </div>

              <div className="try">Try<span className="colon">:</span><a href="/search?q=Deep%20Learning&page=1" onClick={this.handleClick.bind(this)}>Deep Learning</a></div>
            </div>

          </div>

        </div>

        <p className="note">DeepScholar is a free , nonprofit search engine.</p>

      </div> 
    );
  }
}

export default connect(mapStateToProps)(Index);
