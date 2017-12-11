/**
 * Created by DELL on 2017/12/11.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';


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
  play_video = () => {
    const videoPlayer = document.getElementById('videoPlayer1234');
    videoPlayer.play();
  };
  pause_video = () => {
    const videoPlayer = document.getElementById('videoPlayer1234');
    videoPlayer.pause();
  };
  render() {
    return (
      <div className="toolbar">
        <button id="btn_play" onClick={this.play_video}>播放</button>
        <button id="btn_paused" onClick={this.pause_video}>暂停</button>
        <button onClick={this._fullScreen}>全屏</button>
        <button id="btn_tips" onClick={this._handel_notice}>通知</button>
      </div>
    );
  }
}
export default  connect(state => ({videoTrackList: state.videoTrackList.data, activeDrag: state.activeDrag }), {})(ToolBar);