/**
 * Created by DELL on 2017/12/11.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {change_needlePosition, change_needleState} from '@/redux/models/needle';
import {change_play_video} from '@/redux/models/cutVideo/currentPlayingVideo';


class CanvasVideo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPlaying: false,
      currentVideoId: '',
    };
  };
  componentDidMount () {
    this.createCanvas();
  };
  // 在组件接收到一个新的prop时被调用。这个方法在初始化render时不会被调用。
  componentWillReceiveProps (nextProps) {
    // this.props 当前的props
    // nextProps 下一阶段的props
    const {needle} = nextProps;
    const {isPlaying, canvas} = this.state;
    if (!needle.isMoving && isPlaying) {                                                          // 暂停指针移动
      this.stop_needleMove();
    }
    if (needle.isMoving && nextProps.current_playing_video.playerId) {                           // 控制video播放
      const video = document.getElementById(nextProps.current_playing_video.playerId);
      if (video.paused) {
        video.play();
      }
    }

    if (this.props.current_playing_video.playerId !== nextProps.current_playing_video.playerId) { // 有新的video出现
      let {video} = this.state;
      if (nextProps.current_playing_video.playerId) {                                             // 新的video不为空
        const playerId = nextProps.current_playing_video.playerId;
        video = document.getElementById(playerId);
        const {isPlaying} = this.state;
        canvas.width = video.clientWidth || 800;
        canvas.height = video.clientHeight || 600;
        if (isPlaying) {
          video.play();
        }
      } else {                                                                                   // 新的video为空，渲染图片
        video = document.getElementById('defaultImg');
      }
      this.setState({
        video
      })
    }
  };
  // 创建canvas
  createCanvas = () => {
    const {current_playing_video} = this.props;
    let video = '';
    if (current_playing_video.playerId) {
      video = document.getElementById(current_playing_video.playerId);
    } else {
      video = document.getElementById('defaultImg');
    }
    const canvas = document.createElement('canvas'),
      Width = video.clientWidth || this.refs.canvas_video_box.clientWidth || 800,
      Height = video.clientHeight || this.refs.canvas_video_box.clientHeight || 600;
    canvas.width = Width;
    canvas.height = Height;
    this.refs.canvas_video_box.appendChild(canvas);
    canvas.id = 'draw_canvas';
    this.setState({
      ctx: canvas.getContext('2d'),
      Width,
      Height,
      canvas,
      video
    })
  };

  video_click = () => {
    const {isPlaying} = this.state;
    if (isPlaying) {  // 暂停进度条
      this.stop_needleMove();
    } else {         // 播放
      this.start_needleMove();
    }
  };
  // 指针开始移动
  start_needleMove = () => {
    this.props.change_needleState({isMoving: true});
    this.startInterval();
    this.time_add();
  };
  // 指针暂停移动
  stop_needleMove = () => {
    this.props.change_needleState({isMoving: false});
    const {timer} = this.state;
    const {current_playing_video} = this.props;
    clearInterval(timer);
    if (current_playing_video.playerId) {
      const videoPlayer = document.getElementById(current_playing_video.playerId);
      videoPlayer.pause();
    }
    this.setState({
      timer: null,
      isPlaying: false,
    })
  };
  // 轮询
  startInterval = () => {
    let {timer} = this.state;
    if (!timer) {
      timer = setInterval(() => {
        this.time_add();
      }, 100);
      this.setState({
        timer,
        isPlaying: true
      })
    }
  };
  // 点击改变指针位置
  changeNeedle = (left) => {
    this.props.change_needlePosition(left);
  };
  // 轮询时间增加
  time_add = () => {
    this.needle_move();
    this.drawVideoToCanvas();
  };
  // 定时将video画在画布上
  drawVideoToCanvas = () => {
    const {ctx, video, canvas} = this.state;
    if (video) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    }
  };
  // 指针移动
  needle_move = () => {
    const {needle} = this.props;
    const needleLeft = needle.currentTime;
    this.props.change_needlePosition(needleLeft + 1);
  };
  // 测试
  _ceshi = () => {
    console.log(this.props.needle, 'noodel');
  };
  render() {
    const {isPlaying} = this.state;
    return (
      <div className="video_panel">
        <div className="panel_header" />
        <div ref='canvas_video_box' className="canvas_video_box"/>
        <div className="canvas_panel">
          <div className={isPlaying ? 'canvas_btn isPlaying' : 'canvas_btn'} onClick={this.video_click} />
          <div className="canvas_time" onClick={this._ceshi}>
            00:02:50:20
          </div>
          <div className="canvas_progress">
          </div>
        </div>
      </div>
    );
  }
}
export default  connect(state => ({
  videoTrackList: state.videoTrackList.data,
  activeDrag: state.activeDrag,
  needle: state.needle,
  zoom_scale: state.zoom_scale.scale,
  current_playing_video: state.current_playing_video,
}), {change_needlePosition, change_play_video, change_needleState})(CanvasVideo);