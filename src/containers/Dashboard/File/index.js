/**
 * Created by DELL on 2017/12/5.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import './index.css';
import ListCard from './ListCard';
import dragImg from '@/assets/other/example.png';

class File extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [
        {
          type: 'video',
          name: 'video444video444video444',
          src: 'http://toutiao-cdn-jper.foundao.com/ovesystem/data/material/2017/09/07/ymzcut_11709540701101010818201_04bf9d04b5ff80ab2656093b6e4f2617.mp4',
          cover: dragImg,
          title: 'video444video444video444video444',
          origin_time: 8,
          width: '',
          height: ''
        },
        {
          type: 'video',
          name: 'm3u8',
          src: 'http://toutiao-cdn-jper.foundao.com/ovesystem/data/material/2017/11/03/ymzcut_117111303101710108182023_e8875e7ab2e1668794363a5f2fc78dec.mp4',
          cover: dragImg,
          title: 'video4copytitle',
          origin_time: 91,
          width: '',
          height: ''
        },
      ]
    };
  }
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
                  <ListCard item={item} key={index}/>
                  )
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
}), {})(File);