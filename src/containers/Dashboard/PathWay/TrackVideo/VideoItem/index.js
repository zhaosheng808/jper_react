/**
 * Created by DELL on 2017/12/7.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {active_element_change} from '@/redux/models/activeTruckElement';

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
  }
  render() {
    const {itemData, activeElement} = this.props;
    const {zoom_scale} = this.state;
    let isActive = false;
    if (activeElement.type === this.state.type && activeElement.itemIndex === this.props.itemIndex && activeElement.trunkIndex === this.props.trunkIndex) {
      isActive = true;
    }
    return (
      <div className={isActive ? 'truck_inlineBlock slide_active' : 'truck_inlineBlock'} style={{width: `${itemData.time * zoom_scale}px`, left: `${itemData.start * zoom_scale}px`}} onClick={this.activeTruckElement}>
        <div className="element_obj">
          <div>{itemData.name}</div>
        </div>
      </div>
    )
  }
}

export default  connect(state => ({activeElement: state.activeElement }),
  {active_element_change})(VideoItem);