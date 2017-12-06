/**
 * Created by DELL on 2017/11/10.
 */
import React, { Component } from 'react';
// import logo from '../../logo.svg';
import File  from './File';
import PathWay  from './PathWay';
import OperateMessage  from './OperateMessage';
import './dashboard.css';
import mp4 from '@/assets/media/VID_20171123_124935.mp4';
export default
class Dashboard extends Component {
  constructor(props){
    super(props);
    this.state = {
      canvas: null,
      ctx: null,
      Width: '',
      Height: '',
      video: '',
      timer: null                   // 定时器
    };
  }
  componentDidMount () {
    this.createCanvas();
  }
  _fullScreen = () => {
    document.querySelector('html').webkitRequestFullScreen();
  }
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
  }
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
  }
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
  }
  // play
  play_video = () => {
    this.refs.video.play();
    this.startInterval();
  }
  // pause
  pause_video = () => {
    this.refs.video.pause();
    this.stopInterval();
  }
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
  }
  // 暂停
  stopInterval = () => {
    const {timer} = this.state;
    clearInterval(timer);
    this.setState({
      timer: null
    })
  }
  // 轮询时间增加
  time_add = () => {
    this.needle_move();
    this.drawVideoToCanvas();
  }
  // 指针移动
  needle_move = () => {
    this.refs.pathWay.needle_move();
  }
  // 改变脱脂可放的类型
  changeActiveDrag = (type) => {
    this.refs.pathWay.changeActiveDrag(type);
  }
  // 定时将video画在画布上
  drawVideoToCanvas = () => {
    const {ctx, video, Width, Height} = this.state;
    ctx.drawImage(video, 0, 0, Width, Height);
  }
  render() {
    return (
      <div className="dashboard">
        <div className="app_main">
          <div className="app_header">
            <h2>123t头部</h2>
          </div>
          <div className="app_body">
            {/*<!-- 信息展示-->*/}
            <div className="app_panel">
              {/*<!--文件展示-->*/}
              <div className="left_panel">
                <File changeActiveDrag={this.changeActiveDrag} />
              </div>
              {/*<!--video展示-->*/}
              <div className="center_panel">
                <div ref='canvas_video_box' className="canvas_video_box"/>
              </div>
              {/*<!--具体操作信息展示-->*/}
              <div className="right_panel">
                <OperateMessage/>
              </div>
            </div>
            {/*<!-- 操作区域-->*/}
            <div className="app_operation">
              {/*<!-- 操作面板-->*/}
              <div className="operation_panel">
                <button id="btn_play" onClick={this.play_video}>播放</button>
                <button id="btn_paused" onClick={this.pause_video}>暂停</button>
                <button onClick={this._fullScreen}>全屏</button>
                <button id="btn_tips" onClick={this._handel_notice}>通知</button>
              </div>
              {/*<!-- 轨道-->*/}
              <PathWay ref='pathWay' />
            </div>
          </div>
          <video ref='video' className="video" muted controls loop id="video" src={mp4}>你的浏览器不支持video</video>
        </div>
      </div>
    );
  }
}
