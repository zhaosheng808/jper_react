/**
 * Created by DELL on 2017/11/10.
 */
import React, {Component} from 'react';
import { connect } from 'react-redux';
import {change_needleState} from '@/redux/models/needle';
// import logo from '../../logo.svg';
import File  from './File';
import TimeLine  from './TimeLine';
import Needle  from './Needle';
import PathWay  from './PathWay';
import InOut  from './InOut';
import OperateMessage  from './OperateMessage';
import './dashboard.css';
import mp4 from '@/assets/media/VID_20171123_124935.mp4';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canvas: null,
      ctx: null,
      Width: '',
      Height: '',
      video: '',
      app_operation_height: '',      // app_operation height
      timer: null                   // 定时器
    };
  }

  componentDidMount() {
    this.createCanvas();
    this.windows_resize();
    window.onresize = () => {
      this.windows_resize()
    }
    this.refs.video.onpause = () => {
      console.log('暂停了pause');
      this.pause_video();
    }
    this.refs.video.oncanplaythrough = () => {
      console.log('缓冲完毕');
      this.drawVideoToCanvas();
    }
  }

  windows_resize = () => {
    const app_panel_height = this.refs.app_panel.clientHeight;
    const app_operation_height = `calc(100% - ${app_panel_height + 1}px)`;
    this.setState({
      app_operation_height
    })
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
    this.time_add();
    this.refs.video.ontimeupdate = (e) => {
      // console.log(e, 'e');
      // this.time_add();
    }
  }
  // pause
  pause_video = () => {
    this.refs.video.pause();
    // document.getElementById('video').pause();
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
    const {needleLeft, zoom_scale} = this.props;
    this.props.change_needleState(needleLeft + 1);
    const {videoTrackList, } = this.props; // video轨道对象
    const needleLeft_now = needleLeft;
    videoTrackList.forEach((item, index) => {
      if (item.child) {
        item.child.forEach((childItem, childIndex) => {
          const {start, time} = childItem;
          if (needleLeft_now >= start * zoom_scale && needleLeft_now <= parseFloat(start * zoom_scale) + parseFloat(time * zoom_scale)) {
            console.log((needleLeft_now - start * zoom_scale) / zoom_scale , '播放时间-->name  __ ', childItem.name);
          }
        })
      }
    })
  }
  // 点击改变指针位置
  changeNeedle = (left) => {
    // this.refs.needle.changeNeedle(left);
    console.log(left);
    this.props.change_needleState(left);
  }
  // 改变拖拽可放的类型
  changeActiveDrag = (type) => {
    // this.refs.pathWay.changeActiveDrag(type);
    // console.log(this.refs.pathWay)
    // console.log(this.refs.pathWay.changeActiveDrag)
  }
  // 改变展示信息
  changeShowMessage = (data) => {

  }
  // 定时将video画在画布上
  drawVideoToCanvas = () => {
    const {ctx, video, Width, Height} = this.state;
    ctx.drawImage(video, 0, 0, Width, Height);
  }

  render() {
    const {app_operation_height} = this.state;
    return (
      <div className="dashboard">
        <div className="app_header">
          <h2>123t头部</h2>
        </div>
        <div className="app_body">
          {/*<!-- 信息展示-->*/}
          <div className="app_panel" ref='app_panel'>
            {/*<!--具体操作信息展示-->*/}
            <div className="right_panel">
              <OperateMessage/>
            </div>
            <div className="left_panel clear">
              {/*<!--文件展示-->*/}
              <div className="file_panel">
                <File changeActiveDrag={this.changeActiveDrag}/>
              </div>
              {/*<!--video展示-->*/}
              <div className="video_panel">
                <div ref='canvas_video_box' className="canvas_video_box"/>
              </div>
            </div>
          </div>
          {/*<!-- 操作区域-->*/}
          <div className="app_operation" style={{height: app_operation_height}}>
            {/*<!-- 操作面板-->*/}
            <div className="toolbar">
              <button id="btn_play" onClick={this.play_video}>播放</button>
              <button id="btn_paused" onClick={this.pause_video}>暂停</button>
              <button onClick={this._fullScreen}>全屏</button>
              <button id="btn_tips" onClick={this._handel_notice}>通知</button>
            </div>
            <TimeLine changeNeedle={this.changeNeedle} ref='timeLine'/>
            {/*<!-- 轨道-->*/}
            <PathWay ref='pathWay'/>
            <Needle ref='needle'/>
            <InOut />
          </div>
        </div>
        <video ref='video' className="video" muted controls loop id="video" src={mp4}>你的浏览器不支持video</video>
      </div>
    );
  }
}

export default connect(state => ({needleLeft: state.needle.currentTime, videoTrackList: state.videoTrackList.data, zoom_scale: state.zoom_scale.scale}),
  {change_needleState})(Dashboard);
