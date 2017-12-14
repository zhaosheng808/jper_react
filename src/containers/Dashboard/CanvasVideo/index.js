/**
 * Created by DELL on 2017/12/11.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {change_needleState} from '@/redux/models/needle';
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
    if (this.props.current_playing_video.playerId !== nextProps.current_playing_video.playerId) { // 有新的video出现
      let {video, Width, Height} = this.state;
      if (nextProps.current_playing_video.playerId) {                                             // 新的video不为空
        video = document.getElementById(nextProps.current_playing_video.playerId);
        const {isPlaying} = this.state;
        Width = video.clientWidth || 800;
        Height = video.clientHeight || 600;
        if (isPlaying) {
          video.play();
        }
      }
      this.setState({
        currentVideoId: nextProps.current_playing_video,
        video,
        Width,
        Height
      })
    }
  };
  // 创建canvas
  createCanvas = () => {
    const {current_playing_video} = this.props;
    let video = '';
    if (current_playing_video.playerId) {
      video = document.getElementById(current_playing_video.playerId);
    }
    const canvas = document.createElement('canvas'),
      Width = video.clientWidth || 800,
      Height = video.clientHeight || 600;
    canvas.width = Width;
    canvas.height = Height;
    this.refs.canvas_video_box.appendChild(canvas);
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
    this.setState({
      isPlaying: !isPlaying
    })
  };
  // 指针开始移动
  start_needleMove = () => {
    this.startInterval();
    this.time_add();
  };
  // 指针暂停移动
  stop_needleMove = () => {
    const {timer} = this.state;
    const {current_playing_video} = this.props;
    clearInterval(timer);
    if (current_playing_video.playerId) {
      const videoPlayer = document.getElementById(current_playing_video.playerId);
      videoPlayer.pause();
    }
    this.setState({
      timer: null
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
        timer
      })
    }
  };
  // 点击改变指针位置
  changeNeedle = (left) => {
    this.props.change_needleState(left);
  };
  // 轮询时间增加
  time_add = () => {
    this.needle_move();
    this.drawVideoToCanvas();
  };
  // 定时将video画在画布上
  drawVideoToCanvas = () => {
    const {ctx, video} = this.state;
    if (video) {
      ctx.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
    }
  };
  // 指针移动
  needle_move = () => {
    const {needleLeft} = this.props;
    this.props.change_needleState(needleLeft + 1);
    this.check_current_videoPlayer();

  };
  // 判断当前应该是哪个video播放
  check_current_videoPlayer = () => {
    const {needleLeft, zoom_scale, current_playing_video} = this.props;
    const {videoTrackList} = this.props; // video轨道对象
    const needleLeft_now = needleLeft;
    const current_videos = [];
    videoTrackList.forEach((item, index) => {
      if (item.child) {
        item.child.forEach((childItem, childIndex) => {
          const {start_time, time, playerId} = childItem;
          if ( playerId && needleLeft_now >= start_time * zoom_scale && needleLeft_now <= parseFloat(start_time * zoom_scale) + parseFloat(time * zoom_scale)) {
            childItem.level = item.level;
            current_videos.push(childItem);
          } else {
          }
        })
      }
    });
    let now_playing_videoItem = current_videos[0] || {playerId: ''};       // 轮询应该播放的videoItem
    current_videos.forEach((item, index) => {                    // 轮询判断层级较低的video 播放
      if (item.level < now_playing_videoItem.leval) {
        now_playing_videoItem = item;
      }
    });
    if (now_playing_videoItem.playerId !== current_playing_video.playerId) {
      this.props.change_play_video(now_playing_videoItem.playerId);
    }
  };

  render() {
    const {isPlaying} = this.state;
    return (
      <div className="video_panel">
        <div className="panel_header" />
        <div ref='canvas_video_box' className="canvas_video_box"/>
        <div className="canvas_panel">
          <div className={isPlaying ? 'canvas_btn isPlaying' : 'canvas_btn'} onClick={this.video_click} />
          <div className="canvas_time">
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
  needleLeft: state.needle.currentTime,
  zoom_scale: state.zoom_scale.scale,
  current_playing_video: state.current_playing_video,
}), {change_needleState, change_play_video})(CanvasVideo);