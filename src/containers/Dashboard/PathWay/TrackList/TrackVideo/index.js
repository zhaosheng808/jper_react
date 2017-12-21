/**
 * Created by DELL on 2017/12/5.
 */
/**
 * Created by DELL on 2017/12/5.
 */
import React, {Component} from 'react';
import VideoItem from './VideoItem';
import { connect } from 'react-redux';
import globalConfig from '@/global_config';
import {videoTrackList_add, videoTrack_add ,videoTrack_del} from '@/redux/models/videoTrackList';
import {active_element_change} from '@/redux/models/activeTruckElement';
import {change_width} from '@/redux/models/cutVideo/pathWayWidth';

class TrackVideo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'video'
    };
  }
  componentDidMount () {
  }
  componentWillReceiveProps (nextProps) {
    // const {pathWayWidth} = this.props;
    const {videoTrackList, zoom_scale, pathWayWidth} = nextProps;
    let maxTime = 0;
    videoTrackList.forEach((truckItem, truckIndex) => {
      if (truckItem.child) {
        truckItem.child.forEach ((childItem, childIndex) => {
          if (maxTime < childItem.start_time + childItem.time) {
            maxTime = childItem.start_time + childItem.time
          }
        })
      }
    });
    /* 64 轨道左侧空白值 200 最长轨道右侧保留值*/
    const maxWidth = maxTime * zoom_scale + 64 + 200;
    if (pathWayWidth < maxWidth) {
      this.props.change_width(maxWidth);
    }
  };
  _dragover = (event) => {
    const {item, activeDrag} = this.props;
    let isActiveDrag = false;
    if (item.type === activeDrag) {
      isActiveDrag = true;
    }
    if (isActiveDrag) {
      event.preventDefault();
    }
  };
  _drop = (event) => {
    event.preventDefault();
    const pathWay_scrollLeft = document.getElementsByClassName('pathWay')[0].scrollLeft;
    const {drag_offset} = globalConfig;
    const timestamp = Date.parse(new Date());
    const {zoom_scale} = this.props;
    const left = event.clientX - 60 - drag_offset + pathWay_scrollLeft;
    const dropData = JSON.parse(event.dataTransfer.getData("data"));
    const start_time = left / zoom_scale;

    const {
      id,
      playerId,
      type,
      src,
      cover,
      title,
      origin_time,
      time,
      relative_start,
      width,
      height,
      volume,
      speed,
      cutType,
      filter,
      cutTime,
      voice_in_time,
      voice_out_time
    } = dropData;          // 拖拽传递的数据

    // 重新整理存放在store的数据
    const videoItem = {
      id: id || timestamp,                                   // id               id为当前时间戳
      playerId: playerId || 'playerId' + timestamp,          // video播放器       播放器id格式 -- playerId + 时间戳
      type,                                                  // 类型              video/audio/yaTiao
      src,                                                   // src              视频源
      cover,                                                 // cover            封面
      title,                                                 // title            描述
      origin_time,                                           // origin_time      原video时间
      start_time,                                            // start_time       当前视频的起始时间，相对于轨道
      time: time || origin_time,                             // time             当前视频的时间长度
      relative_start: relative_start || 0,                   // relative_start   裁剪视频的起始时间相对于原视频的起始时间
      width,                                                 // 视频宽度
      height,                                                // 视频高度
      volume: volume || 1,                                   // 视频音量
      speed: speed || 1,                                     // 播放速度
      filter: filter || '',                                  // 滤镜类型
      cutType: cutType || '',                                // 转场类型
      cutTime: cutTime || '',                                // 转场时间
      voice_in_time: voice_in_time || '',                    // 音频淡入时间
      voice_out_time: voice_out_time || '',                  // 音频淡出时间
    };
    this.props.videoTrackList_add(videoItem, this.props.trunkIndex);
  };
  // 添加轨道
  _addTruck = () => {
    const {trunkIndex} = this.props;
    this.props.videoTrack_add(trunkIndex);
  };
  // 删除轨道
  _delTruck = () => {
    const {trunkIndex} = this.props;
    this.props.videoTrack_del(trunkIndex)
  };
  render() {
    const {item, activeDrag} = this.props;   // item 每一条轨道对象的数组
    let isActiveDrag = false;
    if (item.type === activeDrag) {
      isActiveDrag = true;
    }
    const {child = []} = item;
    return (
      <div className="track Video">
        <div className='track_head'>
          <div className='menu_icon track_icon' />
          <div className="track_toolbar clear">
            <div className="track_toolbar_inner">
              <div className="menu_icon truck_add" onClick={this._addTruck} />
              <div className="menu_icon truck_del" onClick={this._delTruck} />
            </div>
          </div>
        </div>
        <div className={isActiveDrag ? 'track_body activeDrag' : 'track_body'} onDragOver={this._dragover} onDrop={this._drop} ref='drop'>
          {child.map((itemData, index) => {
            return <VideoItem key={index} itemData={itemData} itemIndex={index} trunkIndex={this.props.trunkIndex} />
          })}
        </div>
      </div>
    )
  }
}
export default  connect(state => ({
    activeElement: state.activeElement,
    videoTrackList: state.videoTrackList.data,
    pathWayWidth: state.pathWayWidth.width,
    zoom_scale: state.zoom_scale.scale}),
  {videoTrackList_add,
    active_element_change,
    videoTrack_add,
    videoTrack_del,
    change_width
  })(TrackVideo);