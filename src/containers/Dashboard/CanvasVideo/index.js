/**
 * Created by DELL on 2017/12/11.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import tools from '@/utils/tools';
import {shortcut_key} from '@/global_config';
import {change_needlePosition, change_needleState} from '@/redux/models/needle';
import TimeDisplayText from '@/components/timeDisplayText';

class CanvasVideo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPlaying: false,
      needleTime: 0,
      currentVideoId: '',
      isKeyDown: false,   // 键盘是否被按下
      video: document.getElementById('defaultImg')
    };
  };
  componentDidMount () {
    this.createCanvas();
    tools.addEventHandler(window, 'keydown', this._keydown);
    tools.addEventHandler(window, 'keyup', this._keyup);
  };
  componentWillUnmount() {
    tools.removeEventHandler(window, 'keydown', this._keydown);
    tools.removeEventHandler(window, 'keyup', this._keyup);
  };
  // 在组件接收到一个新的prop时被调用。这个方法在初始化render时不会被调用。
  componentWillReceiveProps (nextProps) {
    // this.props 当前的props
    // nextProps 下一阶段的props
    const {needle} = nextProps;
    const {videoTrackList, current_playing_video} = this.props;
    const next_playing_video = nextProps.current_playing_video;
    const next_videoTrackList = nextProps.videoTrackList;
    const {isPlaying, canvas} = this.state;
    if (!needle.isMoving && isPlaying) {                                                          // 暂停指针移动
      this.stop_needleMove();
    }

    /*
    * 判断是否切换video播放
    * 当前播放video ！==next 播放video
    *
    * */
    let nowPlay = {};
    if (videoTrackList[current_playing_video.trackIndex]) {
      nowPlay = videoTrackList[current_playing_video.trackIndex].child[current_playing_video.itemIndex] || {};
    }

    let nextPlay = {};
    if (next_videoTrackList[next_playing_video.trackIndex]) {
      nextPlay = next_videoTrackList[next_playing_video.trackIndex].child[next_playing_video.itemIndex] || {};
    }

    // 有新的video出现 ->切换video显示图像
    if (nextPlay.playerId !== nowPlay.playerId) {

      let {video} = this.state;

      if (nextPlay.playerId) {                                             // 新的video不为空
        const playerId = nextPlay.playerId;
        video = document.getElementById(playerId);
        const {isPlaying} = this.state;
        canvas.width = video.clientWidth || 800;
        canvas.height = video.clientHeight || 600;
        // 新新切换视频的当前播放时间 = 相对于原始视频的裁剪 + （指针当前位置 - 视频开始时间）
        video.currentTime = (nextPlay.relative_start + (needle.currentTime - nextPlay.start_time )) / 1000;
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
    if (videoTrackList[current_playing_video.trackIndex]) {
      nextPlay = videoTrackList[current_playing_video.trackIndex].child[current_playing_video.itemIndex];
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

  changePlayState = () => {
    const {isPlaying} = this.state;
    if (isPlaying) {  // 暂停进度条
      this.stop_needleMove();
    } else {         // 播放
      this.start_needleMove();
    }
  };
  // 指针开始移动
  start_needleMove = () => {
    const {current_playing_video, videoTrackList} = this.props;
    let nextPlay = {};
    if (videoTrackList[current_playing_video.trackIndex]) {
      nextPlay = videoTrackList[current_playing_video.trackIndex].child[current_playing_video.itemIndex];
    }
    if (nextPlay.playerId) {
       const video = document.getElementById(nextPlay.playerId);
       if (video.paused) {
         video.play();
       }
    }
    this.props.change_needleState({isMoving: true});
    // this.setState({
    //   isPlaying: true
    // });
    this.startInterval();
    this.time_add();
  };
  // 指针暂停移动
  stop_needleMove = () => {
    this.props.change_needleState({isMoving: false});
    const {timer} = this.state;
    const {current_playing_video, videoTrackList} = this.props;
    let nextPlay = {};
    if (videoTrackList[current_playing_video.trackIndex]) {
      nextPlay = videoTrackList[current_playing_video.trackIndex].child[current_playing_video.itemIndex];
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
      }, 50);
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
    if (video) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    }
  };
  // 指针移动 自然移动 每秒10次
  needle_move = () => {
    const {needle} = this.props;
    const currentTime = needle.currentTime;
    // 指针每次运动距离 50ms
    const step = 50;
    this.props.change_needlePosition(currentTime + step);
  };
  // 指针移动 按帧移动 1s -> 25帧 0.04s
  needle_move_frame = (type) => {
    const {isPlaying} = this.state;
    if (isPlaying) {  // 正在播放 暂停播放
      this.changePlayState();
    }
    const {needle} = this.props;
    const currentTime = needle.currentTime;
    // 指针每次运动距离 1s -> 10 * step
    const step = 0.04 * 1000;
    if (type === -1) {              // 上一帧
      if (currentTime > 0) {
        this.props.change_needlePosition(currentTime - step);
      }
    } else {                       // 下一帧
      this.props.change_needlePosition(currentTime + step);
    }

  };

  // 快捷键
  _keydown = (event) => {
    const {last_frame, next_frame, play} = shortcut_key;
    const e = event || window.event || window.arguments.callee.caller.arguments[0];
    if (e && e.keyCode) {
      switch (e.keyCode) {
        case last_frame:
          event.preventDefault();
          this.needle_move_frame(-1);
          break;
        case next_frame:
          event.preventDefault();
          this.needle_move_frame(1);
          break;
        case play:
          event.preventDefault();
          this.spaceKeyDown();
          break;
        default:
          return;
      }
    }
  };
  // 快捷键
  _keyup = (event) => {
    const {play} = shortcut_key;
    const e = event || window.event || window.arguments.callee.caller.arguments[0];
    if (e && e.keyCode) {
      switch (e.keyCode) {
        case play:
          event.preventDefault();
          this.spaceKeyUp();
          break;
        default:
          return;
      }
    }
  };
  // 空格键按下
  spaceKeyDown () {
    const {isKeyDown} = this.state;
    if (!isKeyDown) {
      this.changePlayState();
      this.setState({
        isKeyDown: true
      })
    }
  };
  spaceKeyUp () {
    this.setState({
      isKeyDown: false
    })
  };
  // 测试
  _ceshi = () => {
    const { state } = this.props;
    console.log(state, 'state');
  };
  render() {
    const {isPlaying} = this.state;
    const {needle} = this.props;
    const needleTime = needle.currentTime / 1000;
    return (
      <div className="video_panel">
        <div className="panel_header" />
        <div ref='canvas_video_box' className="canvas_video_box"/>
        <div className="canvas_panel">
          <div className={isPlaying ? 'canvas_btn isPlaying' : 'canvas_btn'} onClick={this.changePlayState} />
          <div className="canvas_time" onClick={this._ceshi}>
            <TimeDisplayText second = {needleTime}/>
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
  state: state,
  current_playing_video: state.current_playing_video,
}), {
  change_needlePosition,
  change_needleState
})(CanvasVideo);