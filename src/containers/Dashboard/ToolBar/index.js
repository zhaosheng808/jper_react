/**
 * Created by DELL on 2017/12/11.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {change_needleState} from '@/redux/models/needle';

class ToolBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount () {
    this.getCanvas();
  };
  getCanvas = () => {
    const canvas = document.getElementsByClassName('video_panel')[0].getElementsByTagName('canvas')[0];
    const ctx = canvas.getContext('2d');
    this.setState({
      canvas,
      ctx
    })
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
    // const videoPlayer = document.getElementById('videoPlayer1234');
    // videoPlayer.play();
    this.startInterval();
    this.time_add();
  };
  pause_video = () => {
    const {timer} = this.state;
    clearInterval(timer);
    const videoPlayer = document.getElementById('videoPlayer1234');
    videoPlayer.pause();
    this.setState({
      timer: null
    })
  };
  // 轮询时间增加
  time_add = () => {
    this.needle_move();
    this.drawVideoToCanvas();
  };
  // 指针移动
  needle_move = () => {
    const {needleLeft, zoom_scale} = this.props;
    this.props.change_needleState(needleLeft + 1);
    const {videoTrackList, } = this.props; // video轨道对象
    const needleLeft_now = needleLeft;
    // console.log(needleLeft_now, 'needleLeft_now');
    videoTrackList.forEach((item, index) => {
      if (item.child) {
        item.child.forEach((childItem, childIndex) => {
          const {start_time, time, videoPlayer} = childItem;
          if ( videoPlayer && needleLeft_now >= start_time * zoom_scale && needleLeft_now <= parseFloat(start_time * zoom_scale) + parseFloat(time * zoom_scale)) {
            const videoNode = document.getElementById(videoPlayer);
            if (videoNode.paused) {
              videoNode.currentTime = needleLeft_now / zoom_scale;
              videoNode.play();
              videoNode.className = 'video_playing';
            }
          } else {
            // this.refs.video.pause();
          }
        })
      }
    })
  };
  // 定时将video画在画布上
  drawVideoToCanvas = () => {
    const {ctx} = this.state;
    const video = document.getElementById('videoPlayer1234');
    ctx.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
  };
  // 轮询
  startInterval = () => {
    let {timer} = this.state;
    if (!timer) {
      timer = setInterval(() => {
        this.time_add();
      }, 100);
      this.setState({
        timer
      })
    }
  };
  // 点击改变指针位置
  changeNeedle = (left) => {
    this.props.change_needleState(left);
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
export default  connect(state => ({
  videoTrackList: state.videoTrackList.data,
  needleLeft: state.needle.currentTime,
  zoom_scale: state.zoom_scale.scale}),
  {change_needleState}
  )(ToolBar);