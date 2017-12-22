/**
 * Created by DELL on 2017/12/11.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Slider} from 'element-react';
import {change_inPoint, change_outPoint} from '@/redux/models/cutVideo/pointInOut';
import {videoTrack_edit} from '@/redux/models/videoTrackList';
import {change_scale} from '@/redux/models/zoomScale';

import './toolbar.css';

class ToolBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zoom_min: 1,
      zoom_max: 30,
      default_zoom_scale: 10
    };
  }
  componentDidMount () {
    const {zoom_scale} = this.props;
    this.setState({
      default_zoom_scale: zoom_scale
    })
  };
  componentWillReceiveProps (nextProps) {
  };
  _fullScreen = () => {
    document.querySelector('html').webkitRequestFullScreen();
  };
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
  };
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
  };
  _setPointIn = () => {
    const {needleLeft, pointInOut, zoom_scale} = this.props;
    const pointOut_time = pointInOut.outPoint.time;
    const pointIn_time = needleLeft / zoom_scale;
    const pointIn_isShow = pointInOut.outPoint.isShow;
    if (pointIn_time <= pointOut_time || !pointIn_isShow) {
      this.props.change_inPoint(pointIn_time);
    } else {
      alert('出点必须在进点之后哦');
    }

  };
  _setPointOut = () => {
    const {needleLeft, pointInOut, zoom_scale} = this.props;
    const pointIn_time = pointInOut.inPoint.time;
    const pointOut_time = needleLeft / zoom_scale;
    if (pointIn_time <= pointOut_time) {
      this.props.change_outPoint(pointOut_time);
    } else {
      alert('出点必须在进点之后哦');
    }
  };
  // 裁剪掉视频左侧 指针位置划分视频左右
  _cutLeft = () => {
    const {needleLeft, current_playing_video, zoom_scale, videoTrackList} = this.props;
    const {truckIndex, itemIndex} = current_playing_video;
    let playIngVideo = {};
    if (videoTrackList[current_playing_video.truckIndex]) {
      playIngVideo = videoTrackList[current_playing_video.truckIndex].child[current_playing_video.itemIndex];
    }
    const needleTime = needleLeft / zoom_scale;
    if (playIngVideo.playerId) {
      const cut_time = needleTime - playIngVideo.start_time;  // 本次左侧裁剪掉的时间
      const relative_start = playIngVideo.relative_start + cut_time;
      const time = playIngVideo.time - cut_time;
      this.props.videoTrack_edit(truckIndex, itemIndex, {...playIngVideo, time, relative_start, start_time: needleTime});
    }else {
      alert('当前没有视频可以裁剪');
    }

  };
  // 裁剪掉视频右侧
  _cutRight = () => {
    const {needleLeft, current_playing_video, zoom_scale, videoTrackList} = this.props;
    const {truckIndex, itemIndex} = current_playing_video;
    let playIngVideo = {};
    if (videoTrackList[current_playing_video.truckIndex]) {
      playIngVideo = videoTrackList[current_playing_video.truckIndex].child[current_playing_video.itemIndex];
    }
    const needleTime = needleLeft / zoom_scale;
    if (playIngVideo.playerId) {
      const cut_time = playIngVideo.start_time + playIngVideo.time - needleTime;  // 本次右侧裁剪掉的时间
      const time = playIngVideo.time - cut_time;
      this.props.videoTrack_edit(truckIndex, itemIndex, {...playIngVideo, time});
    }else {
      alert('当前没有视频可以裁剪');
    }
  };
  // 比例尺缩小
  _scaleSmall = () => {
    document.querySelector('.zoom_line_box .el-input-number__decrease').click();
  };
  // 比列尺放大
  _scaleLarge = () => {
    document.querySelector('.zoom_line_box .el-input-number__increase').click();
  };
  _change_zoom = (newScale) => {
    const {zoom_scale} = this.props;
    if (newScale !== zoom_scale) {
      this.props.change_scale(newScale);
    }
  };
  render() {
    const {zoom_scale} = this.props;
    const {zoom_min, zoom_max} = this.state;

    return (
      <div className="toolbar">
        <div className="btn_zoom_group btn_group">
          <div className="icon_mini menu_icon" onClick={this._scaleSmall} />
          <div className="zoom_line_box" >
            <span className="zoomNum">{zoom_scale}</span>
            <Slider min={zoom_min}
                    max={zoom_max}
                    value={zoom_scale}
                    showTooltip={false}
                    showInput={true}
                    onChange={this._change_zoom}/>
          </div>
          <div className="icon_max menu_icon" onClick={this._scaleLarge} />
        </div>
        <div className="btn_group btn_step_group">
          <div className="menu_icon icon_revoke large_icon" />
          <div className="menu_icon icon_refresh large_icon" />
        </div>
        <div className="btn_group">
          <div className="menu_icon large_icon icon_cutLeft" onClick={this._cutLeft} />
          <div className="menu_icon large_icon icon_cutRight" onClick={this._cutRight} />
          <div className="menu_icon large_icon icon_magIn" />
          <div className="menu_icon large_icon icon_magOut" />
          <div className="menu_icon large_icon icon_cut" />
          <div className="menu_icon large_icon icon_cover" />
        </div>
        <div className="ben_group btn_project">
          <div className="menu_icon large_icon icon_pointIn" onClick={this._setPointIn} />
          <div className="menu_icon large_icon icon_pointOut" onClick={this._setPointOut} />
          <div className="menu_icon large_icon icon_save" />
          <div className="menu_icon large_icon icon_export" />
        </div>
        {/*<button id="btn_play" onClick={this.play_video}>播放</button>*/}
        {/*<button id="btn_paused" onClick={this.pause_video}>暂停</button>*/}
        <button onClick={this._fullScreen}>全屏</button>
        <button id="btn_tips" onClick={this._handel_notice}>通知</button>
      </div>
    );
  }
}
export default  connect(state => ({
  videoTrackList: state.videoTrackList.data,
  needleLeft: state.needle.currentTime,
  pointInOut: state.pointInOut,
  current_playing_video: state.current_playing_video,
  zoom_scale: state.zoom_scale.scale}),
  {
    change_inPoint,
    change_outPoint,
    change_scale,
    videoTrack_edit}
  )(ToolBar);