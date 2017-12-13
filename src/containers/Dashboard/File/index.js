/**
 * Created by DELL on 2017/12/5.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import './index.css';
import {change_dragActive} from '@/redux/models/dragActive';
import video01 from '@/assets/media/VID_20171123_124935.mp4';

class File extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [
        {
          type: 'video',
          name: 'video444video444video444',
          src: video01,
          cover: '',
          title: 'video444video444video444video444',
          origin_time: 116,
          width: '',
          height: ''
        },
        {
          type: 'video',
          name: 'video4copy',
          src: video01,
          cover: '',
          title: 'video4copytitle',
          origin_time: 116,
          width: '',
          height: ''
        },
      ]
    };
  }

  _dragStart = (listItem, event) => {
    console.log(listItem.type, 'type');
    event.dataTransfer.setData("data", JSON.stringify(listItem));
    this.props.change_dragActive(listItem.type);
    // change_dragActive
  };
  _dragEnd = () => {
    this.props.change_dragActive('');
  };
  upload_click = () => {
    this.refs.upload_source_input.click();
  };

  render() {
    const {list = []} = this.state;
    return (
      <div className="file_panel">
        <div className="panel_header">
          <div className="menu_item menu_media">
            <div className="menu_icon"/>
            <span>媒资库</span></div>
          <div className="menu_item menu_text">
            <div className="menu_icon"/>
            <span>字幕压条</span></div>
          <div className="menu_item menu_effect">
            <div className="menu_icon"/>
            <span>视频特效</span></div>
        </div>
        <div className="panel_body">
          <div className="file_choose_panel">
            文件选择区域
          </div>
          <div className="file_list">
            <div className="file_list_title">
              <div className="list_arrangement">
                <div className="show_list menu_icon" title="列表"/>
                <div className="show_tile menu_icon" title="平铺"/>
              </div>
              <div className="list_origin">
                <span>全部</span>
                <span>云端</span>
                <span>本地</span>
              </div>
            </div>
            <div className="file_list_content">
              <div className="source_card">
                <div className="source_card_body add_source" onClick={this.upload_click} />
                <div className="source_card_footer">添加</div>
              </div>
              {list.map((item, index) => {
                return (
                  <div key={index} className="source_card">
                    <div className="source_card_body" onDragStart={this._dragStart.bind(this, item)}
                         onDragEnd={this._dragEnd} draggable="true">
                      <div className="source_img"/>
                      <div className="source_message">
                        <span className="source_type">{item.type}</span>
                        <span className="source_time">00:00:51:14</span>
                      </div>
                    </div>
                    <div className="source_card_footer">{item.name}</div>
                  </div>)
              })}
            </div>
          </div>
        </div>
        <input type="file" ref='upload_source_input' id="upload_source_input" />

        {/*<div className="list" onDragStart={this._dragStart.bind(this, 'video')} onDragEnd={this._dragEnd} draggable="true">video</div>*/}
        {/*<div className="list" onDragStart={this._dragStart.bind(this, 'text')} onDragEnd={this._dragEnd} draggable="true">text</div>*/}
        {/*<div className="list" onDragStart={this._dragStart.bind(this, 'audio')} onDragEnd={this._dragEnd} draggable="true">audio</div>*/}
      </div>
    );
  }
}
export default  connect(state => ({
  videoTrackList: state.videoTrackList.data,
  activeDrag: state.activeDrag
}), {change_dragActive})(File);