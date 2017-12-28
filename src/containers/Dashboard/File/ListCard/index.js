/**
 * Created by DELL on 2017/12/18.
 */

import React, {Component} from 'react';
import { connect } from 'react-redux';
import {change_dragActive} from '@/redux/models/dragActive';
import dragImg from '@/assets/other/example.png';

import $ from 'jquery';

class ListCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'video'
    };
  }
  componentDidMount () {
    // console.log(this.props);
  }
  _dragStart = (listItem, event) => {
    const offsetX = event.clientX - $(this.refs.source_card).offset().left;
    event.dataTransfer.setData("dropData", JSON.stringify(listItem));
    event.dataTransfer.setData("offsetX", offsetX);
    // event.dataTransfer.setDragImage(this.refs.source_img, drag_offset, this.refs.source_img.clientHeight / 2);
    this.props.change_dragActive(listItem.type);
  };
  _dragEnd = () => {
    this.props.change_dragActive('');
  };
  render() {
    const {item} = this.props;
    return (
      <div className="source_card" ref='source_card'>
        <div className="source_card_body" onDragStart={this._dragStart.bind(this, item)}
             onDragEnd={this._dragEnd} draggable="true">
          <div className="source_img image_box">
            <img ref='source_img' src={item.cover ? item.cover : dragImg} />
          </div>
          <div className="source_message">
            <span className="source_type">{item.type}</span>
            <span className="source_time">{item.origin_time}</span>
          </div>
        </div>
        <div className="source_card_footer">{item.name}</div>
      </div>
    )
  }
}
export default  connect(state => ({
  videoTrackList: state.videoTrackList.data,
}), {change_dragActive})(ListCard);