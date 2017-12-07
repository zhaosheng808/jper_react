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
      <div>
        <p>激活的元素的index</p>
        {JSON.stringify(activeElement)}
        <p>详细信息</p>
        <p>
          {JSON.stringify(activeItem)}
        </p>
      </div>
    );
  }
}
export default connect(state => ({
  activeElement: state.activeElement,
  videoTrackList: state.videoTrackList.data
}))(OperateMessage);