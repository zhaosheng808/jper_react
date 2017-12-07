/**
 * Created by DELL on 2017/12/5.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import './index.css';
import {change_dragActive} from '@/redux/models/dragActive';

class File extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [
        {type: 'video', name: 'video4', start: 250, time: 60},
        {type: 'video', name: 'video5', start: 450, time: 70},
        {type: 'video', name: 'video6', start: 650, time: 90},
        {type: 'audio', name: 'audionew', start: 250, time: 60},
        {type: 'text', name: 'textnew', start: 250, time: 60},
      ]
    };
  }
  _dragStart = (listItem, event) => {
    console.log(listItem.type, 'type');
    event.dataTransfer.setData("data", JSON.stringify(listItem));
    this.props.change_dragActive(listItem.type);
    // change_dragActive
  }
  _dragEnd = () => {
    this.props.change_dragActive('');
  }
  render() {
    const {list = []} = this.state;
    return (
      <div>
       <p>文件</p>
        {list.map((item, index) => {
          return <div key={index} className="list" onDragStart={this._dragStart.bind(this, item)} onDragEnd={this._dragEnd} draggable="true">{item.name}</div>
        })}
        {/*<div className="list" onDragStart={this._dragStart.bind(this, 'video')} onDragEnd={this._dragEnd} draggable="true">video</div>*/}
        {/*<div className="list" onDragStart={this._dragStart.bind(this, 'text')} onDragEnd={this._dragEnd} draggable="true">text</div>*/}
        {/*<div className="list" onDragStart={this._dragStart.bind(this, 'audio')} onDragEnd={this._dragEnd} draggable="true">audio</div>*/}
      </div>
    );
  }
}
export default  connect(state => ({videoTrackList: state.videoTrackList.data, activeDrag: state.activeDrag }), {change_dragActive})(File);