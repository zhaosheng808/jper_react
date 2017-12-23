/**
 * Created by DELL on 2017/12/7.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {active_element_change} from '@/redux/models/activeTrackElement';

class VideoItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'video',
      zoom_scale: 10,   // 1s -> 10px  video 1s -> 轨道10 px
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
  render() {
    const {itemData, activeElement} = this.props;
    const {zoom_scale} = this.state;
    let isActive = false;
    if (activeElement.type === this.state.type && activeElement.itemIndex === this.props.itemIndex && activeElement.trackIndex === this.props.trackIndex) {
      isActive = true;
    }
    return (
      <div className={isActive ? 'clip_item clip_active' : 'clip_item'} style={{width: `${itemData.time * zoom_scale}px`, left: `${itemData.start_time * zoom_scale}px`}} onClick={this.activeTrackElement}>
        <div className="clip_item_img">

        </div>
        <div className="clip_item_desc">{itemData.title}</div>
      </div>
    )
  }
}

export default  connect(state => ({activeElement: state.activeElement }),
  {active_element_change})(VideoItem);