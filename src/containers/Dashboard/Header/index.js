/**
 * Created by DELL on 2017/12/12.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';

class Header extends Component {
  constructor(props){
    super(props);
    this.state = {
    };
  }
  componentDidMount () {

  }
  render() {
    return (
      <div className="app_header">
        <span className="header_title">闪电新闻矩阵号 - 编辑</span>
        <div className="header_tips">
          <div className="help menu_icon" />
          <div className="shortcut menu_icon" />
        </div>
      </div>
    );
  }
}
export default connect(state => ({}),
  {})(Header);