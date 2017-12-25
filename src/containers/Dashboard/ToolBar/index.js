/**
 * Created by DELL on 2017/12/11.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import tools from '@/utils/tools';
import {Slider} from 'element-react';
import {change_inPoint, change_outPoint} from '@/redux/models/cutVideo/pointInOut';
import {change_cover} from '@/redux/models/cutVideo/checkCover';
import {videoTrack_edit, videoTrackList_add} from '@/redux/models/videoTrackList';
import {change_scale} from '@/redux/models/zoomScale';
import {shortcut_key} from '@/global_config';

import './toolbar.css';

class ToolBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zoom_min: 1,
      zoom_max: 30,
      isUtilsKeyDown: false,   // 组合按键 是否按下
      default_zoom_scale: 10
    };
  }
  componentDidMount () {
    const {zoom_scale} = this.props;
    this.setState({
      default_zoom_scale: zoom_scale
    });
    tools.addEventHandler(window, 'keydown', this._keydown);
    tools.addEventHandler(window, 'keyup', this._keyup);
  };
  componentWillUnmount() {
    tools.removeEventHandler(window, 'keydown', this._keydown);
    tools.removeEventHandler(window, 'keyup', this._keyup);
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
    const {trackIndex, itemIndex} = current_playing_video;
    let playIngVideo = {};
    if (videoTrackList[current_playing_video.trackIndex]) {
      playIngVideo = videoTrackList[current_playing_video.trackIndex].child[current_playing_video.itemIndex];
    }
    const needleTime = needleLeft / zoom_scale;
    if (playIngVideo.playerId) {
      const cut_time = needleTime - playIngVideo.start_time;  // 本次左侧裁剪掉的时间
      const relative_start = playIngVideo.relative_start + cut_time;
      const time = playIngVideo.time - cut_time;
      this.props.videoTrack_edit(trackIndex, itemIndex, {...playIngVideo, time, relative_start, start_time: needleTime});
    }else {
      alert('当前没有视频可以裁剪');
    }

  };
  // 裁剪掉视频右侧
  _cutRight = (split) => {
    /*
    * split 是否将右侧裁剪掉的添加到新的素材中
    * */
    const {needleLeft, current_playing_video, zoom_scale, videoTrackList} = this.props;
    const {trackIndex, itemIndex} = current_playing_video;
    let playIngVideo = {};
    if (videoTrackList[current_playing_video.trackIndex]) {
      playIngVideo = videoTrackList[current_playing_video.trackIndex].child[current_playing_video.itemIndex];
    }
    const needleTime = needleLeft / zoom_scale;
    if (playIngVideo.playerId) {
      const cut_time = playIngVideo.start_time + playIngVideo.time - needleTime;  // 本次右侧裁剪掉的时间
      const time = playIngVideo.time - cut_time;
      this.props.videoTrack_edit(trackIndex, itemIndex, {...playIngVideo, time});
      if (split) {
        // 将裁掉的部分新增到轨道中
        const timestamp = Date.parse(new Date());
        const id = timestamp;                                   // id               id为当前时间戳
        const playerId = 'playerId' + timestamp;                             // video播放器       播放器id格式 -- playerId + 时间戳
        const add_time =  playIngVideo.time - time;
        const add_relative_start =  playIngVideo.relative_start + time;
        this.props.videoTrackList_add({
          ...playIngVideo,
          id,
          playerId,
          time: add_time,
          start_time: needleTime,
          relative_start: add_relative_start
        }, trackIndex);
      }
    }else {
      alert('当前没有视频可以裁剪');
    }
  };
  //_cut 裁成两段
  _cut = () => {
    this._cutRight(true);
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
  // 向右吸附
  _magnetRight = () => {
    const {activeElement, videoTrackList} = this.props;
    if (activeElement.type === 'video') {
      const {trackIndex, itemIndex} = activeElement;
      const activeTrack = videoTrackList[trackIndex].child;
      const activeItem = videoTrackList[trackIndex].child[itemIndex];

      const activeItem_endTime = activeItem.start_time + activeItem.time;

      let min_start_time = 0;
      for (let i = 0; i < activeTrack.length; i++) {
        if(activeItem.id !== activeTrack.id){    // 排除自己

          // 如果有起始时间大于选中元素的结束时间 并且最小时间大于该循环的起始时间 则最小起始时间为现在循环的起始时间
          if (activeTrack[i].start_time > activeItem_endTime) {
            if (!min_start_time) {
              min_start_time = activeTrack[i].start_time;
            }else if (min_start_time > activeTrack[i].start_time) {
              min_start_time = activeTrack[i].start_time;
            }
          }
        }
      }
      if (min_start_time !== 0) { //
        const newStartTime = min_start_time - activeItem.time;
        this.props.videoTrack_edit(trackIndex, itemIndex, {...activeItem, start_time: newStartTime});
      }
    } else {
      alert('当前没有选中的video');
    }
  };
  // 向左吸附
  _magnetLeft = () => {
    const {activeElement, videoTrackList} = this.props;
    if (activeElement.type === 'video') {
      const {trackIndex, itemIndex} = activeElement;
      const activeTrack = videoTrackList[trackIndex].child;
      const activeItem = videoTrackList[trackIndex].child[itemIndex];


      let max_start_time = 0;
      for (let i = 0; i < activeTrack.length; i++) {
        if(activeItem.id !== activeTrack.id){    // 排除自己

          // 如果有结束时间小于选中元素的起始时间 并且最大合适起始时间大于该循环的结束时间 则最大合适起始时间为现在循环的结束时间
          if (activeTrack[i].start_time + activeTrack[i].time < activeItem.start_time) {
            if (max_start_time === 0) {  // 初始为 0 需要单独判断，如果没有就默认为他
              max_start_time =  activeTrack[i].start_time + activeTrack[i].time;
            } else if (max_start_time < activeTrack[i].start_time + activeTrack[i].time){
              max_start_time  =  activeTrack[i].start_time + activeTrack[i].time
            }
          }
        }
      }

      if (max_start_time !== 0) { //
        this.props.videoTrack_edit(trackIndex, itemIndex, {...activeItem, start_time: max_start_time});
      }
    } else {
      alert('当前没有选中的video');
    }
  };
  // 覆盖挤压
  _changeCover = () => {
    /*-1: 不开启 1:开启 默认开启覆盖检测，即不能覆盖*/
    const {checkCover} = this.props;
    this.props.change_cover( -checkCover );
  };
  // 保存
  _save = () => {

  };
  // 导出
  _export = () => {

  };
  // 快捷键
  _keydown = (event) => {
    const {cut_left, cut_right, ctrl} = shortcut_key;
    const e = event || window.event || window.arguments.callee.caller.arguments[0];
    if (e && e.keyCode) {
      switch (e.keyCode) {
        case cut_left[1]:
          event.preventDefault();
          this.cutVideo(-1);
          break;
        case cut_right[1]:
          event.preventDefault();
          this.cutVideo(1);
          break;
        case ctrl:
          event.preventDefault();
          this.utilsKeyDown();
          break;
        default:
          return;
      }
    }
  };
  // 快捷键
  _keyup = (event) => {
    const {ctrl} = shortcut_key;
    const e = event || window.event || window.arguments.callee.caller.arguments[0];
    if (e && e.keyCode) {
      switch (e.keyCode) {
        case ctrl:
          event.preventDefault();
          this.utilsKeyUp();
          break;
        default:
          return;
      }
    }
  };
  cutVideo (direction) {
    /*
    * direction 裁剪方向 -1 ：left 1 right
    * */
    const {isUtilsKeyDown} = this.state;
    if (isUtilsKeyDown) {  // 如果shift 按下了才会有反应
      if (direction === -1) {
        this._cutLeft();
      } else if (direction === 1) {
        this._cutRight();
      }
    }

  }
  utilsKeyDown () {
    this.setState({
      isUtilsKeyDown: true
    })
  }
  utilsKeyUp () {
    this.setState({
      isUtilsKeyDown: false
    })
  }
  render() {
    const {zoom_scale, checkCover} = this.props;
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
          <div className="menu_icon large_icon icon_cutLeft" title="裁剪左侧" onClick={this._cutLeft} />
          <div className="menu_icon large_icon icon_cutRight" title="裁剪右侧" onClick={this._cutRight} />
          <div className="menu_icon large_icon icon_magIn" title="向前吸附" onClick={this._magnetLeft} />
          <div className="menu_icon large_icon icon_magOut" title="向后吸附" onClick={this._magnetRight} />
          <div className="menu_icon large_icon icon_cut" title="裁分" onClick={this._cut} />
          <div className={checkCover === 1 ? 'menu_icon large_icon icon_crush' : 'menu_icon large_icon icon_cover'} title="覆盖挤压" onClick={this._changeCover} />
        </div>
        <div className="ben_group btn_project">
          <div className="menu_icon large_icon icon_pointIn" title="进点" onClick={this._setPointIn}  />
          <div className="menu_icon large_icon icon_pointOut" title="出点" onClick={this._setPointOut} />
          <div className="menu_icon large_icon icon_save" title="保存" onClick={this._save} />
          <div className="menu_icon large_icon icon_export" title="导出" onClick={this._export} />
        </div>
        {/*<button id="btn_play" onClick={this.play_video}>播放</button>*/}
        {/*<button id="btn_paused" onClick={this.pause_video}>暂停</button>*/}
        {/*<button onClick={this._fullScreen}>全屏</button>*/}
        {/*<button id="btn_tips" onClick={this._handel_notice}>通知</button>*/}
      </div>
    );
  }
}
export default  connect(state => ({
  videoTrackList: state.videoTrackList.data,
  needleLeft: state.needle.currentTime,
  pointInOut: state.pointInOut,
  current_playing_video: state.current_playing_video,
  activeElement: state.activeElement,
  checkCover: state.checkCover.cover,
  zoom_scale: state.zoom_scale.scale}),
  {
    change_inPoint,
    change_outPoint,
    change_scale,
    videoTrack_edit,
    videoTrackList_add,
    change_cover}
  )(ToolBar);