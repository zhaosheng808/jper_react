/**
 * Created by DELL on 2017/12/11.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';

import {change_inPoint, change_outPoint} from '@/redux/models/cutVideo/pointInOut';

import './toolbar.css';
class ToolBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount () {

  };
  _fullScreen = () => {
    document.querySelector('html').webkitRequestFullScreen();
  };
  popNotice = () => {
    if (Notification.permission === "granted") {
      const notification = new Notification("Hi，帅哥：", {
        body: '可以加你为好友吗？',
        icon: 'http://image.zhangxinxu.com/image/study/s/s128/mm1.jpg'
      });
      notification.onclick = function () {
        alert('张小姐已于' + new Date().toTimeString().split(' ')[0] + '加你为好友！');
        notification.close();
      };
    }
  };
  _handel_notice = () => {
    const _this = this;
    console.log(Notification.permission, 'Notification.permission');
    if (Notification.permission === "granted") {
      this.popNotice();
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission(function (permission) {
        _this.popNotice();
      });
    }
  };
  _setPointIn = () => {
    const {needleLeft, pointInOut, zoom_scale} = this.props;
    const pointOut_time = pointInOut.outPoint.time;
    const pointIn_time = needleLeft / zoom_scale;
    if (pointIn_time <= pointOut_time ) {
      this.props.change_inPoint(pointIn_time);
    } else {
      alert('出点必须在进点之后哦');
    }

  };
  _setPointOut = () => {
    const {needleLeft, pointInOut, zoom_scale} = this.props;
    const pointIn_time = pointInOut.inPoint.time;
    const pointOut_time = needleLeft / zoom_scale;
    if (pointIn_time <= pointOut_time) {
      this.props.change_outPoint(pointOut_time);
    } else {
      alert('出点必须在进点之后哦');
    }

  };
  render() {
    return (
      <div className="toolbar">
        <div className="btn_zoom_group btn_group">
          <div className="icon_mini menu_icon" />
          <div className="zoom_line_box">
          </div>
          <div className="icon_max menu_icon" />
        </div>
        <div className="btn_group btn_step_group">
          <div className="menu_icon icon_revoke large_icon" />
          <div className="menu_icon icon_refresh large_icon" />
        </div>
        <div className="btn_group">
          <div className="menu_icon large_icon icon_cutLeft" />
          <div className="menu_icon large_icon icon_cutRight" />
          <div className="menu_icon large_icon icon_magIn" />
          <div className="menu_icon large_icon icon_magOut" />
          <div className="menu_icon large_icon icon_cut" />
          <div className="menu_icon large_icon icon_cover" />
        </div>
        <div className="ben_group btn_project">
          <div className="menu_icon large_icon icon_pointIn" onClick={this._setPointIn} />
          <div className="menu_icon large_icon icon_pointOut" onClick={this._setPointOut} />
          <div className="menu_icon large_icon icon_save" />
          <div className="menu_icon large_icon icon_export" />
        </div>
        {/*<button id="btn_play" onClick={this.play_video}>播放</button>*/}
        {/*<button id="btn_paused" onClick={this.pause_video}>暂停</button>*/}
        <button onClick={this._fullScreen}>全屏</button>
        <button id="btn_tips" onClick={this._handel_notice}>通知</button>
      </div>
    );
  }
}
export default  connect(state => ({
  videoTrackList: state.videoTrackList.data,
  needleLeft: state.needle.currentTime,
  pointInOut: state.pointInOut,
  zoom_scale: state.zoom_scale.scale}),
  {
    change_inPoint,
    change_outPoint}
  )(ToolBar);