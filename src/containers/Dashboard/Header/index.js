/**
 * Created by DELL on 2017/12/12.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import ShortCutLayer from '@/components/shortcutKey';

class Header extends Component {
  constructor(props){
    super(props);
    this.state = {
      is_shortCutShow: false
    };
  }
  componentDidMount () {

  }
  _showShortCut = () => {
    this.setState({
      is_shortCutShow: true
    })
  };
  _closeShortCut = () => {
    // this.setState({
    //   is_shortCutShow: false
    // })
  };
  render() {
    const {is_shortCutShow} = this.state;
    return (
      <div className="app_header">
        <span className="header_title">闪电新闻矩阵号 - 编辑</span>
        <div className="header_tips">
          <div className="help menu_icon" />
          <div className="shortcut menu_icon" onClick={this._showShortCut} />
        </div>
        <ShortCutLayer shortCutShow={is_shortCutShow} />
      </div>
    );
  }
}
export default connect(state => ({}),
  {})(Header);