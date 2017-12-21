/**
 * Created by DELL on 2017/12/11.
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {change_needlePosition, change_needleState} from '@/redux/models/needle';
import $ from 'jquery';

class VodeoPlayerItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canvas: null,
      ctx: null,
      timer: null,      // 定时器
    };
  }

  componentDidMount() {
    // this.getCanvas();
    // this.refs.video.onpause = () => {
    //   console.log('暂停了pause');
    //   this.pause_video();
    // };
    // this.refs.video.oncanplaythrough = () => {
    //   console.log('缓冲完毕');
    //   this.drawVideoToCanvas();
    // };
    this.refs.video.onplay = () => {
      $('.videoPlayers_wrapper video').removeClass('video_playing');
      $(this.refs.video).addClass('video_playing');
    }
  };
  componentWillReceiveProps (nextProps) {
    const {videoTrackList, current_playing_video} = nextProps;
    let nextPlay = {};
    if (videoTrackList[current_playing_video.truckIndex]) {
      nextPlay = videoTrackList[current_playing_video.truckIndex].child[current_playing_video.itemIndex];
    }
    const nextPlayerId = nextPlay.playerId;
    const itemPlayerId = this.props.itemData.playerId;
    // console.log(nextPlayerId, 'nextPlayerId');
    if (nextPlayerId !== itemPlayerId) {                       // 当前渲染的视频不为本视频  暂停视频的播放
      this.refs.video.onpause = () => {
      };
      this.refs.video.oncanplaythrough = () => {
      };
      if (!this.refs.video.paused) {
        console.log('未暂停');
        this.refs.video.pause();
      }
    } else {                                                  // 当前渲染的视频为本视频
      // console.log(111);
      // 如果没有播放 需要将指针当前位置映射到video的currentTime 拖拽进行绘制
      if (this.refs.video.paused) {
        const {needleLeft, zoom_scale, itemData} = this.props; // 指针位置 刻度线比例
        const needleTime = needleLeft / zoom_scale;
        const {start_time, relative_start} = itemData;
        this.refs.video.currentTime = needleTime - start_time + relative_start;
      }
      this.refs.video.oncanplaythrough = () => {
        this.drawVideoToCanvas();
      };
      this.refs.video.onpause = () => {
        console.log('nextPlayerId暂停了pause', nextPlayerId);
        // this.pause_video();
      };
    }
  };
  start_play = () => {

  };
  // pause
  pause_video = () => {
    this.props.change_needleState({isMoving: false});
  };
  drawVideoToCanvas = () => {
    const ctx = document.getElementById('draw_canvas').getContext('2d');
    const {current_playing_video, videoTrackList} = this.props;
    let nextPlay = {};
    if (videoTrackList[current_playing_video.truckIndex]) {
      nextPlay = videoTrackList[current_playing_video.truckIndex].child[current_playing_video.itemIndex];
    }
    const video = document.getElementById(nextPlay.playerId);
    if (video) {
      ctx.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
    }
  };
  render() {
    const {itemData} = this.props;
    // console.log(itemData, 'itemDataVideo');
    return (
      <video ref='video' controls preload="true" id={itemData.playerId} src={itemData.src}>你的播放器不支持video</video>
    );
  }
}

export default connect(state => ({
  videoTrackList: state.videoTrackList.data,
  needleLeft: state.needle.currentTime,
  zoom_scale: state.zoom_scale.scale,
  current_playing_video: state.current_playing_video

}), {change_needlePosition, change_needleState})(VodeoPlayerItem);