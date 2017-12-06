/**
 * Created by DELL on 2017/12/5.
 */
import React, { Component } from 'react';
import './index.css';

export default
class File extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  _dragStart = (type, event) => {
    console.log(type, 'type');
    event.dataTransfer.setData("data", JSON.stringify({type: type, id: 20}));
    this.props.changeActiveDrag(type);
  }
  _dragEnd = () => {
    this.props.changeActiveDrag('');
  }
  render() {
    return (
      <div>
       <p>文件</p>
        <div className="list" onDragStart={this._dragStart.bind(this, 'video')} onDragEnd={this._dragEnd} draggable="true">video</div>
        <div className="list" onDragStart={this._dragStart.bind(this, 'text')} onDragEnd={this._dragEnd} draggable="true">text</div>
        <div className="list" onDragStart={this._dragStart.bind(this, 'audio')} onDragEnd={this._dragEnd} draggable="true">audio</div>
      </div>
    );
  }
}