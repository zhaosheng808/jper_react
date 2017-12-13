/**
 * Created by DELL on 2017/12/5.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';

class OperateMessage extends Component {

  render() {
    const {activeElement, videoTrackList} = this.props;
    let activeItem = {};
    if (activeElement.type === 'video') {
      activeItem = videoTrackList[activeElement.trunkIndex].child[activeElement.itemIndex];
    }
    return (
      <div className="infoPanel">
        <div className="panel_header">
          <div className="menu_item menu_info"><div className="menu_icon" /><span>信息</span></div>
          <div className="menu_item menu_result"><div className="menu_icon" /><span>效果</span></div>
        </div>
        <div className="panel_body">
          <div className="media_info">
            <div className="base_info">1280*720 / 30p / NTSC / 单声道 / 49kHz</div>
            <div className="change_info">上次修改时间 2107-10-01 10:00:01</div>
          </div>
          <div className="list_info">
            <div className="info_item">
              <span className="info_label">名称</span>
              <div className="info_value">共享单车回放</div>
            </div>
            <div className="info_item">
              <span className="info_label">格式</span>
              <div className="info_value">MP4</div>
            </div>
            <div className="info_item">
              <span className="info_label">初始来源</span>
              <div className="info_value">闪电新闻</div>
            </div>
            <div className="info_item">
              <span className="info_label">添加时间</span>
              <div className="info_value">2017-12-13 12:00:01</div>
            </div>
          </div>
          <p>激活的元素的index</p>
          {JSON.stringify(activeElement)}
          <p>详细信息</p>
          <p>
            {JSON.stringify(activeItem)}
          </p>
        </div>
      </div>
    );
  }
}
export default connect(state => ({
  activeElement: state.activeElement,
  videoTrackList: state.videoTrackList.data
}))(OperateMessage);