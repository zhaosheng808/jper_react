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
    const {current_playing_video} = this.props;
    if (current_playing_video.playerId) {
      const videoPlayer = document.getElementById(current_playing_video.playerId);
      if (!videoPlayer.paused) {
        videoPlayer.pause()
      }
    }
    const left = event.clientX - 64;
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
  current_playing_video: state.current_playing_video
}), {change_needlePosition})(TimeLine);