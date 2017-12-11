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
    this.refs.video.onpause = () => {
      console.log('暂停了pause');
      this.pause_video();
    };
    this.refs.video.oncanplaythrough = () => {
      console.log('缓冲完毕');
      this.drawVideoToCanvas();
    }
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
  // 创建canvas
  createCanvas = () => {
    const canvas = document.createElement('canvas'),
      Width = this.refs.video.clientWidth || 400 / 2,
      Height = this.refs.video.clientHeight || 711 / 2;
    canvas.width = Width;
    canvas.height = Height;
    this.refs.canvas_video_box.appendChild(canvas);
    const video = this.refs.video;
    this.setState({
      ctx: canvas.getContext('2d'),
      Width,
      Height,
      canvas,
      video
    })
  };
  // play
  play_video = () => {
    // this.refs.video.play();
    this.startInterval();
    this.time_add();
    this.refs.video.ontimeupdate = (e) => {
      // console.log(e, 'e');
      // this.time_add();
    }
  };
  // pause
  pause_video = () => {
    this.refs.video.pause();
    // document.getElementById('video').pause();
    this.stopInterval();
  };
  // 暂停
  stopInterval = () => {
    const {timer} = this.state;
    clearInterval(timer);
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
    videoTrackList.forEach((item, index) => {
      if (item.child) {
        item.child.forEach((childItem, childIndex) => {
          console.log(childItem, 'childItem');
          const videoPlayer = document.getElementById('');
          const {start, time} = childItem;
          if (needleLeft_now >= start * zoom_scale && needleLeft_now <= parseFloat(start * zoom_scale) + parseFloat(time * zoom_scale)) {
            console.log((needleLeft_now - start * zoom_scale) / zoom_scale , '播放时间-->name  __ ', childItem.name);
            this.refs.video.play();
          } else {
            // this.refs.video.pause();
          }
        })
      }
    })
  };
  // 点击改变指针位置
  changeNeedle = (left) => {
    // this.refs.needle.changeNeedle(left);
    console.log(left);
    this.props.change_needleState(left);
  };
  // 定时将video画在画布上
  drawVideoToCanvas = () => {
    const {ctx, video, Width, Height} = this.state;
    ctx.drawImage(video, 0, 0, Width, Height);
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