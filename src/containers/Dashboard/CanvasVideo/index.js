/**
 * Created by DELL on 2017/12/11.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import tools from '@/utils/tools';
import {shortcut_key} from '@/global_config';
import {change_needlePosition, change_needleState} from '@/redux/models/needle';



class CanvasVideo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPlaying: false,
      currentVideoId: '',
      video: document.getElementById('defaultImg')
    };
  };
  componentDidMount () {
    this.createCanvas();
    tools.addEventHandler(window, 'keydown', this._keydown);
  };
  componentWillUnmount() {
    tools.removeEventHandler(window, 'keydown', this._keydown);
  };
  // 在组件接收到一个新的prop时被调用。这个方法在初始化render时不会被调用。
  componentWillReceiveProps (nextProps) {
    // this.props 当前的props
    // nextProps 下一阶段的props
    const {needle} = nextProps;
    const {zoom_scale, videoTrackList, current_playing_video} = this.props;
    const next_playing_video = nextProps.current_playing_video;
    const {isPlaying, canvas} = this.state;
    if (!needle.isMoving && isPlaying) {                                                          // 暂停指针移动
      this.stop_needleMove();
    }

    // 有新的video出现 ->切换video显示图像
    if (!(current_playing_video.truckIndex === next_playing_video.truckIndex && current_playing_video.itemIndex === next_playing_video.itemIndex)) {

      let {video} = this.state;
      let nextPlay = {};
      if (videoTrackList[next_playing_video.truckIndex]) {
        nextPlay = videoTrackList[next_playing_video.truckIndex].child[next_playing_video.itemIndex];
      }
      if (nextPlay.playerId) {                                             // 新的video不为空
        const playerId = nextPlay.playerId;
        video = document.getElementById(playerId);
        const {isPlaying} = this.state;
        canvas.width = video.clientWidth || 800;
        canvas.height = video.clientHeight || 600;
        // 新新切换视频的当前播放时间 = 相对于原始视频的裁剪 + （指针当前位置 - 视频开始时间）
        video.currentTime = nextPlay.relative_start + (needle.currentTime / zoom_scale - nextPlay.start_time );
        if (isPlaying) {
          video.play();
        }
      } else {                                                                                   // 新的video为空，渲染图片
        video = document.getElementById('defaultImg');
        const {ctx, canvas} = this.state;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      }
      this.setState({
        video
      })
    }
  };
  // 创建canvas
  createCanvas = () => {
    const {current_playing_video, videoTrackList} = this.props;

    let nextPlay = {};
    if (videoTrackList[current_playing_video.truckIndex]) {
      nextPlay = videoTrackList[current_playing_video.truckIndex].child[current_playing_video.itemIndex];
    }
    let video = '';
    let Width = 800;
    let Height = 600;

    if (nextPlay.playerId) {
      video = document.getElementById(nextPlay.playerId);
      Width = video.clientWidth;
      Height = video.clientHeight;
    } else {
      video = document.getElementById('defaultImg');
      Width = this.refs.canvas_video_box.clientWidth;
      Height = this.refs.canvas_video_box.clientHeight;
    }
    const canvas = document.createElement('canvas');
    canvas.width = Width;
    canvas.height = Height;
    this.refs.canvas_video_box.appendChild(canvas);
    canvas.id = 'draw_canvas';
    const ctx =  canvas.getContext('2d');
    video.onload = () => {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    };
    this.setState({
      ctx,
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
    const {current_playing_video, videoTrackList} = this.props;
    let nextPlay = {};
    if (videoTrackList[current_playing_video.truckIndex]) {
      nextPlay = videoTrackList[current_playing_video.truckIndex].child[current_playing_video.itemIndex];
    }
    clearInterval(timer);
    if (nextPlay.playerId) {
      const videoPlayer = document.getElementById(nextPlay.playerId);
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
  // 轮询时间增加
  time_add = () => {
    this.needle_move();
    this.drawVideoToCanvas();
  };
  // 定时将video画在画布上
  drawVideoToCanvas = () => {
    const {ctx, video, canvas} = this.state;
    // console.log(video, 'video');
    if (video) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    }
  };
  // 指针移动 -> 向右
  needle_move = () => {
    const {needle, zoom_scale} = this.props;
    const needleLeft = needle.currentTime;
    // 指针每次运动距离 1s -> 10 * step
    const step = zoom_scale / 10;
    this.props.change_needlePosition(needleLeft + step);
  };
  // 指针移动 -> 向左
  needle_move_left = () => {
    const {needle, zoom_scale} = this.props;
    const needleLeft = needle.currentTime;
    // 指针每次运动距离 1s -> 10 * step
    const step = zoom_scale / 10;
    if (needleLeft > 0) {
      this.props.change_needlePosition(needleLeft - step);
    }
  };
  // 左右快捷键
  _keydown = (event) => {
    const {last_frame, next_frame} = shortcut_key;
    const e = event || window.event || window.arguments.callee.caller.arguments[0];
    if (e && e.keyCode) {
      switch (e.keyCode) {
        case last_frame:
          this.needle_move_left();
          break;
        case next_frame:
          this.needle_move();
          break;
        default:
          return;
      }
    }
  };
  // 测试
  _ceshi = () => {
    const {videoTrackList, current_playing_video} = this.props;
    console.log(this.props.needle, 'noodel');

    let nextPlay = {};
    if (videoTrackList[current_playing_video.truckIndex]) {
      console.log(videoTrackList[current_playing_video.truckIndex], 'videoTrackList[current_playing_video.truckIndex]');
      nextPlay = videoTrackList[current_playing_video.truckIndex].child[current_playing_video.itemIndex];
    }
    console.log(current_playing_video, 'current_playing_videoTruck');
    console.log(nextPlay, 'nextPlay');
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
}), {
  change_needlePosition,
  change_needleState
})(CanvasVideo);