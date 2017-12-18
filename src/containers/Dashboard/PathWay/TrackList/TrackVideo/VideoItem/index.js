/**
 * Created by DELL on 2017/12/7.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {active_element_change} from '@/redux/models/activeTruckElement';
import {change_dragActive} from '@/redux/models/dragActive';
import {videoTrackList_del} from '@/redux/models/videoTrackList';
import globalConfig from '@/global_config';

class VideoItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'video',
      zoom_scale: 10,   // 1s -> 10px  video 1s -> 轨道10 px
    };
  }
  activeTruckElement = () => {
    const {type} = this.state;
    const {itemIndex, trunkIndex} = this.props;
    this.props.active_element_change({
      type,
      trunkIndex: trunkIndex,
      itemIndex: itemIndex
    })
  };
  _dragStart = (listItem, event) => {
    const {drag_offset} = globalConfig;
    event.dataTransfer.setData("data", JSON.stringify(listItem));
    event.dataTransfer.setDragImage(this.refs.clip_item, drag_offset, this.refs.clip_item.clientHeight / 2);
    this.props.change_dragActive(listItem.type);
  };
  _dragEnd = () => {
    this.props.change_dragActive('');
    // 移除掉现有的轨道节点
    const {trunkIndex, itemIndex} = this.props;
    this.props.videoTrackList_del(trunkIndex, itemIndex);
  };
  render() {
    const {itemData, activeElement} = this.props;
    const {zoom_scale} = this.state;
    let isActive = false;
    if (activeElement.type === this.state.type && activeElement.itemIndex === this.props.itemIndex && activeElement.trunkIndex === this.props.trunkIndex) {
      isActive = true;
    }
    return (
      <div className={isActive ? 'clip_item clip_active' : 'clip_item'}
           style={{width: `${itemData.time * zoom_scale}px`, left: `${itemData.start_time * zoom_scale}px`}}
           onClick={this.activeTruckElement}
           draggable="true"
           onDragStart={this._dragStart.bind(this, itemData)}
           onDragEnd={this._dragEnd}
           ref='clip_item'>
        <div className="clip_item_img">
          <img src={itemData.cover} />
        </div>
        <div className="clip_item_desc">{itemData.title}</div>
        <div className="left resize_handel" />
        <div className="right resize_handel" />
      </div>
    )
  }
}

export default connect(state => ({activeElement: state.activeElement}),
  { active_element_change,
    change_dragActive,
    videoTrackList_del
  })(VideoItem);