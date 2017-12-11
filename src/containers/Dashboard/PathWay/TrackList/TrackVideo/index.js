/**
 * Created by DELL on 2017/12/5.
 */
/**
 * Created by DELL on 2017/12/5.
 */
import React, {Component} from 'react';
import VideoItem from './VideoItem';
import { connect } from 'react-redux';
import {videoTrackList_add} from '@/redux/models/videoTrackList';
import {active_element_change} from '@/redux/models/activeTruckElement';

class TrackVideo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'video'
    };
  }
  componentDidMount () {
   // console.log(this.props);
  }
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
    const timestamp = Date.parse(new Date());
    const {zoom_scale} = this.props;
    const left = event.clientX - 60;
    event.preventDefault();
    const dropData = JSON.parse(event.dataTransfer.getData("data"));
    const start_time = left / zoom_scale;

    const {src, cover, title, origin_time, width, height}  = dropData;
    console.log(src, 'src');
    const videoItem = {
      id: timestamp,                                         // id               id为当前时间戳
      videoPlayer: 'videoPlayer' + timestamp,                // video播放器       播放器id格式 -- videoPlayer + 时间戳
      src,                                                   // src              视频源
      cover,                                                 // cover            封面
      title,                                                 // title            描述
      origin_time,                                           // origin_time      原video时间
      start_time,                                            // start_time       当前视频的起始时间，相对于轨道
      time: origin_time,                                     // time             当前视频的时间长度
      relative_start: 0,                                     // relative_start   裁剪视频的起始时间相对于原视频的起始时间
      width,                                                 // 视频宽度
      height,                                                // 视频高度
      volume: 1,                                             // 视频音量
      speed: 1,                                              // 播放速度
      filter: '',                                            // 滤镜类型
      cutType: '',                                           // 转场类型
      cutTime: '',                                           // 转场时间
      voice_in_time: '',                                     // 音频淡入时间
      voice_out_time: '',                                    // 音频淡出时间
    };
    console.log(videoItem, 'videoItem');
    this.props.videoTrackList_add(videoItem, this.props.index);
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
        <div className='track_type'>{item.type}</div>
        <div className={isActiveDrag ? 'track_body activeDrag' : 'track_body'} onDragOver={this._dragover} onDrop={this._drop} ref='drop'>
          {child.map((itemData, index) => {
            return <VideoItem key={index} itemData={itemData} itemIndex={index} trunkIndex={this.props.index} />
          })}
        </div>
      </div>
    )
  }
}
export default  connect(state => ({admin: state.admin, activeElement: state.activeElement, zoom_scale: state.zoom_scale.scale}),
  {videoTrackList_add,
  active_element_change})(TrackVideo);