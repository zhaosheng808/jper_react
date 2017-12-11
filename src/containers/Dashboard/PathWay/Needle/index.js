/**
 * Created by DELL on 2017/12/6.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {change_needleState} from '@/redux/models/needle';
import tools from '@/utils/tools';

class Needle extends Component {
  constructor(props){
    super(props);
    this.state = {
      left: 0,
      isMoseDown: false,
      startX: 0
    };
  }
  componentDidMount () {
    tools.addEventHandler(document.body, 'mouseup', this.needle_mouseUp);
    console.log('mounted');
  }
  needle_mouseMove = (event) => {
    tools.addEventHandler(document.body, 'mousemove', this.changechangeNeedle_move);
  };
  changechangeNeedle_move = (event) => {
    document.getElementById('video').pause();
    const {startX, startLeft} = this.state;
    const endX = event.clientX;
    const moveX =  endX - startX;
    let nowLeft = startLeft + moveX;
    if (nowLeft < 0) {
      nowLeft = 0
    }
    this.props.change_needleState(nowLeft);
    document.getElementById('video').currentTime = nowLeft;
    this.checkAllItemInNeedle();
  };
  needle_mouseDown = (event) => {
    const startLeft = this.props.needleLeft;
    this.setState({
      startX: event.clientX,
      startLeft: startLeft,
      isMoseDown: true
    });
    this.needle_mouseMove();
  };
  needle_mouseUp = () => {
    tools.removeEventHandler(document.body, 'mousemove', this.changechangeNeedle_move);
    this.setState({
      isMoseDown: false
    });
    this.checkAllItemInNeedle();
  };
  checkAllItemInNeedle = () => {
    const {videoTrackList} = this.props;
    const {needleLeft, zoom_scale} = this.props;
    console.log(needleLeft, 'needleLeft');
    console.log(zoom_scale, 'zoom_scale');
    videoTrackList.forEach((item, index) => {
      if (item.child) {
        item.child.forEach((childItem, childIndex) => {
          const {start_time, time, videoPlayer} = childItem;
          const videoPlayerNode = document.getElementById(videoPlayer);
          if (needleLeft >= start_time * zoom_scale && needleLeft <= parseFloat(start_time * zoom_scale) + parseFloat(time * zoom_scale)) {
            // video在指针播放区域
            videoPlayerNode.play();
          }
        })
      }
    })
  };
  render() {
    const {needleLeft} = this.props;
    return (
      <div className="needle" ref='needle' onMouseDown={this.needle_mouseDown.bind(this)} style={{'left': `${needleLeft}px`}}/>
    );
  }
}
export default connect(state => ({needleLeft: state.needle.currentTime, videoTrackList: state.videoTrackList.data, zoom_scale: state.zoom_scale.scale}),
  {change_needleState})(Needle);