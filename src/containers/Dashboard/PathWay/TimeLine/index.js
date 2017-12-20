/**
 * Created by DELL on 2017/12/6.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {change_needlePosition} from '@/redux/models/needle';
import './timeLine.css';

// @connect(
//   (state) => ({
//     current_playing_video: state.current_playing_video
//   }),
//   {change_needlePosition}
// )

class TimeLine extends Component {
  constructor(props){
    super(props);
    this.state = {
    };
  }
  changeNeedle = (event) => {
    event.stopPropagation();
    const pathWay_scrollLeft = document.getElementsByClassName('pathWay')[0].scrollLeft;
    const {current_playing_video, videoTrackList} = this.props;
    const playIngVideo = videoTrackList[current_playing_video.truckIndex].child[current_playing_video.itemIndex];
    if (playIngVideo.playerId) {
      const videoPlayer = document.getElementById(playIngVideo.playerId);
      if (!videoPlayer.paused) {
        videoPlayer.pause()
      }
    }
    const left = event.clientX - 64 + pathWay_scrollLeft;
    this.props.change_needlePosition(left);
  };
  render() {
    return (
      <div className="timeLine">
        <div className="time_axis_box">
          <div className="time_axis" onClick={this.changeNeedle} />
        </div>
      </div>
    );
  }
}
export default connect(state => ({
  current_playing_video: state.current_playing_video,
  videoTrackList: state.videoTrackList
}), {change_needlePosition})(TimeLine);