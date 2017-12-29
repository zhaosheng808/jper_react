/**
 * Created by DELL on 2017/12/29.
 */
/**
 * Created by DELL on 2017/12/5.
 */
import React, {Component} from 'react';

import './index.css';


export default
class RightBtnTips extends Component {
  constructor(props) {
    super(props);
    this.state = {
      top: 0,
      left: 0,
      is_show: false
    }
  }
  componentDidMount () {
    //去掉默认的contextmenu事件，否则会和右键事件同时出现。
    document.oncontextmenu = function(e){
      e.preventDefault();
    };
  };
  show = (left, top, delFun) => {
    this.del = delFun;
    this.setState({
      left,
      top,
      is_show: true
    });
    this.refs.btn_del.onclick = delFun;
    document.body.addEventListener('click', this.close);
  };
  close = () => {
    const {is_show} = this.state;
    if (is_show) {
      this.setState({
        is_show: false
      })
    }
  };
  render() {
    const {left = 0, top = 0, is_show} = this.state;
    return (
      <div className={is_show ? 'right_tips is_show' : 'right_tips'} style={{left: `${left}px`, top: `${top}px`}}>
        <div className="choose_item" ref='btn_del'>删除</div>
        {/*<div className="choose_item">删除</div>*/}
      </div>
    );
  }
}