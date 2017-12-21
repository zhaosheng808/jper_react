/**
 * Created by DELL on 2017/12/6.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import tools from '@/utils/tools';
import {change_needlePosition} from '@/redux/models/needle';
import './timeLine.css';

class TimeLine extends Component {
  constructor(props){
    super(props);
    this.state = {
      time_axis_width: 1000,
      timeArr: ['00:00:00']
    };
  }
  componentDidMount() {
    this.initTimeArr();
    const {addEventHandler} = tools;
    addEventHandler(window, 'resize', this.windows_resize);
  }
  componentWillUnmount() {
    const {removeEventHandler} = tools;
    removeEventHandler(window, 'resize', this.windows_resize);
  };
  initTimeArr = () => {
    const {zoom_scale} = this.props;
    const time_axis = window.parseInt(this.refs.time_axis.clientWidth);
    const seconds = time_axis / zoom_scale;
    const timeArr = [];
    for (let i = 0; i< seconds; i++) {
      timeArr.push(this.secondToDate(i));
    }
    this.setState({
      timeArr
    })
  };
  windows_resize = () => {
    this.initTimeArr();
  };
  //秒转化成 时分秒
  secondToDate = (seconds) => {
    let h = Math.floor(seconds / 3600).toString();
    let m = Math.floor((seconds / 60 % 60)).toString();
    let s = Math.floor((seconds % 60)).toString();
    if (h.length < 2) {
      h = '0' + h;
    };
    if (m.length < 2) {
      m = '0' + m;
    };
    if (s.length < 2) {
      s = '0' + s;
    };
    return h + ':' + m + ':' + s;
  };
  _resize = () => {
    console.log(111);
  };
  changeNeedle = (event) => {
    event.stopPropagation();
    const pathWay_scrollLeft = document.getElementsByClassName('pathWay')[0].scrollLeft;
    const {current_playing_video, videoTrackList} = this.props;
    let playIngVideo = {};
    if (videoTrackList[current_playing_video.truckIndex]) {
      playIngVideo = videoTrackList[current_playing_video.truckIndex].child[current_playing_video.itemIndex];
    }
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
    const {timeArr} = this.state;
    const {zoom_scale} = this.props;
    const timeSecond = {
      marginRight: zoom_scale - 1 + 'px'
    };
    return (
      <div className="timeLine">
        <div className="time_axis_box">
          <div className="time_axis" ref='time_axis' onClick={this.changeNeedle} >
            {timeArr.map((item, index) => {
              if (index % 15 === 0) {
                return <span className="timeSecond highLight" key={index} style={timeSecond}><i>{item}</i></span>
              } else {
                return <span className="timeSecond" key={index} style={timeSecond} />
              }
            })}
          </div>
        </div>
      </div>
    );
  }
}
export default connect(state => ({
  current_playing_video: state.current_playing_video,
  videoTrackList: state.videoTrackList,
  zoom_scale: state.zoom_scale.scale
}), {change_needlePosition})(TimeLine);