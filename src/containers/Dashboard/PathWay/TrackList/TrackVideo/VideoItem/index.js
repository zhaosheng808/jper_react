/**
 * Created by DELL on 2017/12/7.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import tools from '@/utils/tools';
import {active_element_change} from '@/redux/models/activeTrackElement';
import {change_dragActive} from '@/redux/models/dragActive';
import {videoTrackList_del, videoTrack_edit} from '@/redux/models/videoTrackList';
import {add_history} from '@/redux/models/cutVideo/historyStore';
import $ from 'jquery';

class VideoItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'video',
      startX: 0,
      isMoseDown: false,
      startLeft: 0,
      startWidth: 0,     // 初始宽度
      direction: '',     // 拖拽把手方向 left / right
      relative_start: '', //  拖拽相对于起始位置relative_start
      startMove_time: 0 // 开始移动时video的时间
    };
  }
  activeTrackElement = () => {
    const {type} = this.state;
    const {itemIndex, trackIndex} = this.props;
    this.props.active_element_change({
      type,
      trackIndex: trackIndex,
      itemIndex: itemIndex
    })
  };
  _dragStart = (listItem, event) => {
    const offsetX = event.clientX - $(this.refs.clip_item).offset().left;
    const {itemIndex, trackIndex} = this.props;
    event.dataTransfer.setData("dropData", JSON.stringify({...listItem, trackIndex, itemIndex}));
    event.dataTransfer.setData("offsetX", offsetX);
    // event.dataTransfer.setDragImage(this.refs.clip_item);
    this.props.change_dragActive(listItem.type);
  };
  _dragEnd = () => {
    // this.props.change_dragActive('');
    // // 移除掉现有的轨道节点
    //
    // /* 修改redux数据为异步,但是可以直接在此处移除，因为drop里面的方法接受的数据是直接添加在数组后面的
    // *  如果在drop里面删除，会导致不能触发本节点的dragEnd事件
    // * */
    //
    // /* 经测试先执行drop才会执行dragEnd*/
    // const {trackIndex, itemIndex} = this.props;
    // this.props.videoTrackList_del(trackIndex, itemIndex);

  };
  _saveHistory = () => {
    /*
     * 保存历史记录
     * */
    console.log(this.props.state.videoTrackList.data, '222');
    const {state} = this.props;
    this.props.add_history(state);
  };


  _mouseDown = (direction, event) => {
    event.stopPropagation();
    event.preventDefault();
    const {itemData, zoom_scale} = this.props;
    const startWidth = itemData.time * zoom_scale;
    const startLeft = itemData.start_time * zoom_scale;
    const relative_start = itemData.relative_start;
    const startMove_time = itemData.time;
    this.setState({
      startX: event.clientX,
      startWidth,
      startLeft,
      direction,
      relative_start,
      startMove_time,
      isMoseDown: true
    });
    tools.addEventHandler(document.body, 'mousemove', this.clipItem_move);
    tools.addEventHandler(document.body, 'mouseup', this.left_mouseUp);
  };
  clipItem_move = (event) => {
    // const pathWay_scrollLeft = document.querySelector('.pathWay').scrollLeft;
    const {zoom_scale, itemData, trackIndex, itemIndex} = this.props;
    const {startWidth, startX, startLeft, direction, relative_start, startMove_time} = this.state;

    const {origin_time, time} = itemData;
    const endX = event.clientX;
    const moveX = endX - startX;
    let nowTime = 0,
      left = 0;
    if (direction === 'right') {             // 右边的把手
      nowTime = (startWidth + moveX) / zoom_scale;

      if (nowTime > origin_time - relative_start) {
        nowTime = origin_time - relative_start
      }
      if (nowTime < 0) {
        nowTime = 0
      }

      this.props.videoTrack_edit(trackIndex, itemIndex, {...itemData, time: nowTime});

    } else {                                // 左边的把手
      /* 只通过起始位置和相对于原视频的起始位置 这两个值计算出left和time*/

      let now_relative_start = relative_start + moveX / zoom_scale;   // 相对于原始视频的起始时间


      if (now_relative_start < 0) {                                // 如果向左侧拉动到了原始视频的最开始，则不能拉动了
        now_relative_start = 0;
      } else if (now_relative_start > (time + relative_start) * zoom_scale) {  // 如果向右拖拽超出现有的item的宽度
        now_relative_start = origin_time - time;
      }
      const realMoveX = (now_relative_start - relative_start) * zoom_scale; // 节点真实移动的距离
      left = startLeft + realMoveX;
      nowTime = startMove_time - realMoveX / zoom_scale;
      if (left < 0) {
        left = 0;
      }
      this.props.videoTrack_edit(trackIndex, itemIndex, {...itemData, start_time: left / zoom_scale, time: nowTime, relative_start: now_relative_start});
    }
  };
  left_mouseUp = () => {
    tools.removeEventHandler(document.body, 'mousemove', this.clipItem_move);
    tools.removeEventHandler(document.body, 'mouseup', this.left_mouseUp);
    this.setState({
      isMoseDown: false
    });
  };
  render() {
    const {itemData, activeElement, zoom_scale} = this.props;
    let isActive = false;
    if (activeElement.type === this.state.type && activeElement.itemIndex === this.props.itemIndex && activeElement.trackIndex === this.props.trackIndex) {
      isActive = true;
    }
    return (
      <div className={isActive ? 'clip_item clip_active' : 'clip_item'}
           style={{width: `${itemData.time * zoom_scale}px`, left: `${itemData.start_time * zoom_scale}px`}}
           onClick={this.activeTrackElement}
           draggable="true"
           onDragStart={this._dragStart.bind(this, itemData)}
           onDragEnd={this._dragEnd}
           ref='clip_item'>
          <div className="clip_inner">
            <div className="clip_item_img">
              <img src={itemData.cover} />
            </div>
            <div className="clip_item_desc">{itemData.name}</div>
          </div>
        <div className="left resize_handel" onMouseDown={this._mouseDown.bind(this, 'left')} />
        <div className="right resize_handel" onMouseDown={this._mouseDown.bind(this, 'right')} />
      </div>
    )
  }
}

export default connect(state => ({
    activeElement: state.activeElement,
    history: state.historyStore.history,
    state: state,
    zoom_scale: state.zoom_scale.scale}),
  { active_element_change,
    change_dragActive,
    videoTrackList_del,
    add_history,
    videoTrack_edit
  })(VideoItem);