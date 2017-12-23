/**
 * Created by DELL on 2017/12/5.
 */
/**
 * Created by DELL on 2017/12/5.
 */
import React, {Component} from 'react';
import VideoItem from './VideoItem';
import { connect } from 'react-redux';
import {videoTrackList_add, videoTrack_add ,videoTrack_del, videoTrackList_del, videoTrack_edit} from '@/redux/models/videoTrackList';
import {active_element_change} from '@/redux/models/activeTrackElement';
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
    videoTrackList.forEach((trackItem, trackIndex) => {
      if (trackItem.child) {
        trackItem.child.forEach ((childItem, childIndex) => {
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

    /* 当轨道数据修改了， 判断各个元素之间是否有覆盖*/
    if (nextProps.checkCover === 1) { // 如果开启了，才检测
      this.checkCover(nextProps);
    }
  };
  /* 判断各个元素之间是否有覆盖*/
  checkCover = (nextProps) => {
    /* 轨道内判断是否拖拽重叠 */
    // 将本数据与原本存在的数据进行比较
    const {trackIndex, videoTrackList} = nextProps;   // 本条轨道的index
    const allChild = videoTrackList[trackIndex].child;
    let hasCover = false;                         // 用于标识是否有重叠部分，阻止forEach继续执行
    allChild.forEach((item, index) => {
      allChild.forEach((secondItem, secondIndex) => {
        if (item.id !== secondItem.id) { // 排除自己

          if (hasCover) { // 阻止forEach继续执行
            return false
          }

          // 判断自己与其他压条是否起始时间冲突
          if (secondItem.start_time < item.start_time && item.start_time < secondItem.start_time + secondItem.time) {
            console.log('起始时间冲突');
            hasCover = true;
            const newStartTime = secondItem.start_time + secondItem.time;
            this.props.videoTrack_edit(trackIndex, index, {...item, start_time: newStartTime});
            return false
          }
        }
      });

    });

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
    const pathWay_scrollLeft = document.querySelector('.pathWay').scrollLeft;
    const App_scrollLeft = document.querySelector('.App').scrollLeft;

    // 获取传递的数据
    const dropData = JSON.parse(event.dataTransfer.getData("dropData"));
    const offsetX = event.dataTransfer.getData("offsetX");

    const timestamp = Date.parse(new Date());
    const {zoom_scale} = this.props;
    let left = event.clientX - 64 - offsetX + pathWay_scrollLeft + App_scrollLeft;
    if (left < 0) { // 如果超过边缘，则从0开始
      left = 0
    }

    let dropForm = 0;  // 数据来源 0 -> 列表  1 ->轨道  默认为列表
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
      voice_out_time,
      trackIndex,
      itemIndex
    } = dropData;

    // 判断drop数据来源
    if (typeof(trackIndex) === 'number' && typeof(itemIndex) === 'number') { // 是从轨道拖拽过来的 轨道index 和item index 类型为number 可能为0
      dropForm = 1
    }






    const start_time = left / zoom_scale;       // 视频起始时间




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





    /*判断完毕 整合数据存入redux中*/



    /*
    * 直接添加本节点到轨道数组中
    * 如果是原本存在的，会在dragEnd事件里面删除掉原来的数据，这里不需要处理
    * */
    this.props.videoTrackList_add(videoItem, this.props.trackIndex);
  };
  // 添加轨道
  _addTrack = () => {
    const {trackIndex, videoTrackList} = this.props;
    if (videoTrackList.length >= 2) {
      alert('最多只能两条视频轨道');
    } else {
      this.props.videoTrack_add(trackIndex);
    }
  };
  // 删除轨道
  _delTrack = () => {
    const {trackIndex, videoTrackList} = this.props;
    if (videoTrackList.length <= 1) {
      alert('至少保留一条轨道');
    } else {
      this.props.videoTrack_del(trackIndex);
    }

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
              <div className="menu_icon track_add" onClick={this._addTrack} />
              <div className="menu_icon track_del" onClick={this._delTrack} />
            </div>
          </div>
        </div>
        <div className={isActiveDrag ? 'track_body activeDrag' : 'track_body'} onDragOver={this._dragover} onDrop={this._drop} ref='drop'>
          {child.map((itemData, index) => {
            return <VideoItem key={index} itemData={itemData} itemIndex={index} trackIndex={this.props.trackIndex} />
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
    checkCover: state.checkCover.cover,
    zoom_scale: state.zoom_scale.scale}),
  {videoTrackList_add,
    active_element_change,
    videoTrack_add,
    videoTrack_del,
    videoTrackList_del,
    videoTrack_edit,
    change_width
  })(TrackVideo);