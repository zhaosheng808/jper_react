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
    // this.check_current_videoPlayer();
  }
  componentWillReceiveProps (nextProps) {
    // 如果比例尺发生了变化 先修改指针的位置再判断当前的播放器
    if (nextProps.zoom_scale !== this.props.zoom_scale) {
      this.changeNeedleLeft(nextProps);
      return;
    }
    this.check_current_videoPlayer(nextProps);
  };
  // 比例尺发生变化 指针对应的位置也将发生变化
  changeNeedleLeft = (nextProps) => {
    const origin_scale = this.props.zoom_scale;
    const next_scale = nextProps.zoom_scale;
    const origin_left = this.props.needle.currentTime;
    const next_left = (origin_left / origin_scale) * next_scale;
    this.props.change_needlePosition(next_left);
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
  needle_mouseMove = () => {
    tools.addEventHandler(document.body, 'mousemove', this.changeNeedle_move);
    tools.addEventHandler(document.body, 'mouseup', this.needle_mouseUp);
  };
  changeNeedle_move = (event) => {
    const {current_playing_video, videoTrackList} = this.props;
    let playIngVideo = {};
    if (videoTrackList[current_playing_video.trackIndex]) {
      playIngVideo = videoTrackList[current_playing_video.trackIndex].child[current_playing_video.itemIndex];
    }
    if (playIngVideo.playerId) {
      const player = document.getElementById(playIngVideo.playerId);
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
  needle_mouseUp = () => {
    tools.removeEventHandler(document.body, 'mousemove', this.changeNeedle_move);
    tools.removeEventHandler(document.body, 'mouseup', this.needle_mouseUp);
    this.setState({
      isMoseDown: false
    });
  };

  // 判断当前应该是哪个video播放
  check_current_videoPlayer = (nextProps) => {
    const {needle, zoom_scale, current_playing_video, videoTrackList} = nextProps;
    let next_playIngVideo = {};
    if (videoTrackList[current_playing_video.trackIndex]) {
      next_playIngVideo = videoTrackList[current_playing_video.trackIndex].child[current_playing_video.itemIndex];
    }
    // 根据当前指针时间找到对应播放的视频对象数组
    const needleLeft_now = needle.currentTime;
    const canPlay_videos = [];                 // 当前指针指到的videos
    videoTrackList.forEach((item, index) => {

      if (item.child) {
        const track_canPlay_videos = [];
        item.child.forEach((childItem, childIndex) => {
          const {start_time, time, playerId} = childItem;
          if ( playerId && needleLeft_now >= start_time * zoom_scale && needleLeft_now <= parseFloat(start_time * zoom_scale) + parseFloat(time * zoom_scale)) {
            childItem.level = item.level;
            childItem.trackIndex = index;
            childItem.itemIndex = childIndex;
            track_canPlay_videos.push(childItem);
          } else {
          }
        });

        // 每条轨道数组选择最后一个 加入 canPlay_videos 每条轨道中最后操作的优先级较高
        if (track_canPlay_videos.length > 0) {
          canPlay_videos.push(track_canPlay_videos[track_canPlay_videos.length - 1]);
        }
      }

    });
    let now_playing_videoItem = canPlay_videos[0] || {};       // 轮询应该播放的videoItem
    canPlay_videos.forEach((item, index) => {                    // 轮询判断层级较低的video 播放
      if (item.level < now_playing_videoItem.leval) {
        now_playing_videoItem = item;
      }
    });

    if (next_playIngVideo) {
      if (now_playing_videoItem.playerId !== next_playIngVideo.playerId) {
        let trackIndex = -1,
          itemIndex = -1;
        if (now_playing_videoItem.trackIndex !== undefined) {
          trackIndex = now_playing_videoItem.trackIndex;
        }
        if (now_playing_videoItem.itemIndex !== undefined) {
          itemIndex = now_playing_videoItem.itemIndex;
        }
        this.props.change_play_video(trackIndex, itemIndex);
      }
    } else {                              // 没有视频播放，制空当前播放视频
      this.props.change_play_video(-1, -1);
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