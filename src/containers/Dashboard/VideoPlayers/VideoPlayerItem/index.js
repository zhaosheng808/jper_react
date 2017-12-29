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
      blobSrc: '',      // video通过blob下载到本地的src
      timer: null,      // 定时器
    };
  }

  componentDidMount() {
    this.check_isCurrentVideo();
    /*通过blob预加载
    * 会导致video切换后 src才加载完毕，导致video顺序变化但src未变化
    *
    * */

    // this.boble_load();


    // this.getCanvas();
    // this.refs.video.onpause = () => {
    //   console.log('暂停了pause');
    //   this.pause_video();
    // };
    // this.refs.video.oncanplaythrough = () => {
    //   console.log('缓冲完毕');
    //   this.drawVideoToCanvas();
    // };

    // $.ajax({
    //   url: itemData.src,
    //   method: 'get',
    //   dataType: 'blob',
    // });

    this.refs.video.onplay = () => {
      $('.videoPlayers_wrapper video').removeClass('video_playing');
      $(this.refs.video).addClass('video_playing');
    };
/*    this.refs.video.addEventListener("progress", function() {
      console.log(0);
      // When buffer is 1 whole video is buffered
      if (Math.round(this.refs.video.buffered.end(0)) / Math.round(this.refs.video.seekable.end(0)) === 1) {
        console.log(1111);
        // Entire video is downloaded
      }
    }, false);*/
  };
  check_isCurrentVideo = () => {
    const {videoTrackList, current_playing_video} = this.props;
    let nowPlay = {};
    if (videoTrackList[current_playing_video.trackIndex]) {
      nowPlay = videoTrackList[current_playing_video.trackIndex].child[current_playing_video.itemIndex];
    }
    const itemPlayerId = this.props.itemData.playerId;
    if (nowPlay.playerId && nowPlay.playerId === itemPlayerId) {  // 当前播放视频为改对象的视频
      this.refs.video.oncanplaythrough = () => {
        this.drawVideoToCanvas();
      };
    }
  };
  boble_load = () => {
    /*
     * 通过blob预加载
     * 发现并没有什么卵用
     * */
    const {itemData} = this.props;
    const req = new XMLHttpRequest();
    const _this = this;
    req.open('GET', itemData.src, true);
    req.responseType = 'blob';
    req.onload = function() {
      // Onload is triggered even on 404
      // so we need to check the status code
      if (this.status === 200) {
        const videoBlob = this.response;
        const vid = URL.createObjectURL(videoBlob); // IE10+
        // Video is now downloaded
        // and we can set it as source on the video element
        // video.src = vid;
        _this.setState({
          blobSrc: vid
        })
      }
    };
    req.onerror = function() {
      // Error
    };
    req.send();
  };
  componentWillReceiveProps (nextProps) {
    const {videoTrackList, current_playing_video} = nextProps;
    let nextPlay = {};
    if (videoTrackList[current_playing_video.trackIndex]) {
      nextPlay = videoTrackList[current_playing_video.trackIndex].child[current_playing_video.itemIndex];
    }
    const nextPlayerId = nextPlay.playerId;
    const itemPlayerId = this.props.itemData.playerId;

    if (nextPlayerId !== itemPlayerId) {                       // 当前渲染的视频不为本视频  暂停视频的播放
      this.refs.video.onpause = () => {
      };
      this.refs.video.oncanplaythrough = () => {
      };
      if (!this.refs.video.paused) {
        this.refs.video.pause();
      }
    } else if (itemPlayerId !== undefined){                                                  // 当前渲染的视频为本视频
      // 如果没有播放 需要将指针当前位置映射到video的currentTime 拖拽进行绘制
      if (this.refs.video.paused) {
        const {itemData} = this.props; // 指针位置 刻度线比例
        const {needleLeft, zoom_scale} = nextProps; // 指针位置 比例
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
    if (videoTrackList[current_playing_video.trackIndex]) {
      nextPlay = videoTrackList[current_playing_video.trackIndex].child[current_playing_video.itemIndex];
    }
    const video = document.getElementById(nextPlay.playerId);
    if (video) {
      ctx.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
    }
  };
  render() {
    const {itemData} = this.props;
    const {blobSrc} = this.state;
    // console.log('blobSrc', blobSrc);
    // console.log(itemData, 'itemDataVideo');
    return (
      <video ref='video' controls preload="true" id={itemData.playerId} src={ blobSrc || itemData.src }>你的播放器不支持video</video>
    );
  }
}

export default connect(state => ({
  videoTrackList: state.videoTrackList.data,
  needleLeft: state.needle.currentTime,
  zoom_scale: state.zoom_scale.scale,
  current_playing_video: state.current_playing_video

}), {change_needlePosition, change_needleState})(VodeoPlayerItem);