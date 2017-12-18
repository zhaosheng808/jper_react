/**
 * Created by DELL on 2017/12/6.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import tools from '@/utils/tools';
import {change_needlePosition, change_needleState} from '@/redux/models/needle';
import {change_play_video} from '@/redux/models/cutVideo/currentPlayingVideo';

class Needle extends Component {
  constructor(props){
    super(props);
    this.state = {
      left: 0,
      isMoseDown: false,
      startX: 0
    };
  }
  componentDidMount () {
  }
  componentWillReceiveProps (nextProps) {
    this.check_current_videoPlayer();
  };
  needle_mouseMove = (event) => {
    tools.addEventHandler(document.body, 'mousemove', this.changeNeedle_move);
    tools.addEventHandler(document.body, 'mouseup', this.needle_mouseUp);
  };
  changeNeedle_move = (event) => {
    const {current_playing_video} = this.props;
    if (current_playing_video.playerId) {
      const player = document.getElementById(current_playing_video.playerId);
      if (!player.paused) {
        player.pause();
      }
    }
    const {startX, startLeft} = this.state;
    const endX = event.clientX;
    const moveX =  endX - startX;
    let nowLeft = startLeft + moveX;
    if (nowLeft < 0) {
      nowLeft = 0
    }
    this.props.change_needleState({isMoving: false});
    this.props.change_needlePosition(nowLeft);
  };
  needle_mouseDown = (event) => {
    const {needle} = this.props;
    const startLeft = needle.currentTime;

    this.setState({
      startX: event.clientX,
      startLeft: startLeft,
      isMoseDown: true
    });
    this.needle_mouseMove();
  };
  needle_mouseUp = () => {
    tools.removeEventHandler(document.body, 'mousemove', this.changeNeedle_move);
    tools.removeEventHandler(document.body, 'mouseup', this.needle_mouseUp);
    this.setState({
      isMoseDown: false
    });
  };

  // 判断当前应该是哪个video播放
  check_current_videoPlayer = () => {
    const {needle, zoom_scale, current_playing_video} = this.props;
    const needleLeft = needle.currentTime;
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
    const {needle} = this.props;
    const needleLeft = needle.currentTime;
    return (
      <div className="needle" ref='needle' onMouseDown={this.needle_mouseDown.bind(this)} style={{'left': `${needleLeft}px`}} >
        <div className="needle_handle" />
      </div>
    );
  }
}
export default connect(state => ({
    needle: state.needle,
    videoTrackList: state.videoTrackList.data,
    current_playing_video: state.current_playing_video,
    zoom_scale: state.zoom_scale.scale}),
  {change_needlePosition,
  change_play_video,
  change_needleState})(Needle);