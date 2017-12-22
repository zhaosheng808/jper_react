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
  componentWillReceiveProps (nextProps) {
    /* 如果比例或者轨道长度发生变化 从新渲染刻度线*/
    if (this.props.zoom_scale !== nextProps.zoom_scale || this.props.zoom_scale.pathWayWidth !== nextProps.pathWayWidth) {
      this.initTimeArr(nextProps);
    }
  };
  componentDidMount() {
    this.initTimeArr();
    const {addEventHandler} = tools;
    addEventHandler(window, 'resize', this.windows_resize);
  }
  componentWillUnmount() {
    const {removeEventHandler} = tools;
    removeEventHandler(window, 'resize', this.windows_resize);
  };
  initTimeArr = (nextProps) => {
    let {zoom_scale} = this.props;
    let time_axis = window.parseInt(this.refs.time_axis.clientWidth);
    if (nextProps) {
      zoom_scale = nextProps.zoom_scale;
      const next_time_axis = nextProps.pathWayWidth - 64;
      if (time_axis < next_time_axis) {
        time_axis = next_time_axis;
      }
    }

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
  changeNeedle = (event) => {
    event.stopPropagation();
    const pathWay_scrollLeft = document.querySelector('.pathWay').scrollLeft;
    const App_scrollLeft = document.querySelector('.App').scrollLeft;
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
    const left = event.clientX - 64 + pathWay_scrollLeft + App_scrollLeft;
    this.props.change_needlePosition(left);
  };
  _renderTimeSecond = () => {
    const {zoom_scale} = this.props;
    const {timeArr} = this.state;
    const timeSecond = {
      marginRight: zoom_scale - 1 + 'px'
    };
    /* 根据不同的比例tile_lime 刻度绥随着变化*/
    return (
      timeArr.map((item, index) => {
        if (zoom_scale > 9) {
          if (index % 15 === 0) {
            return <span className="timeSecond highLight" key={index} style={timeSecond}><i>{item}</i></span>
          } else {
            return <span className="timeSecond" key={index} style={timeSecond}/>
          }
        } else if (zoom_scale > 3){
          if (index % 30 === 0) {
            return <span className="timeSecond highLight" key={index} style={timeSecond}><i>{item}</i></span>
          } else {
            return <span className="timeSecond" key={index} style={timeSecond}/>
          }
        } else if (zoom_scale > 2){
          if (index % 60 === 0) {
            return <span className="timeSecond highLight" key={index} style={timeSecond}><i>{item}</i></span>
          } else {
            return <span className="timeSecond" key={index} style={timeSecond}/>
          }
        } else {
          if (index % 120 === 0) {
            return <span className="timeSecond highLight" key={index} style={timeSecond}><i>{item}</i></span>
          } else {
            return <span className="timeSecond" key={index} style={timeSecond}/>
          }
        }

      })
    )
  };
  render() {
    return (
      <div className="timeLine">
        <div className="time_axis_box">
          <div className="time_axis" ref='time_axis' onClick={this.changeNeedle} >
            {this._renderTimeSecond()}
          </div>
        </div>
      </div>
    );
  }
}
export default connect(state => ({
  current_playing_video: state.current_playing_video,
  videoTrackList: state.videoTrackList,
  pathWayWidth: state.pathWayWidth.width,
  zoom_scale: state.zoom_scale.scale
}), {change_needlePosition})(TimeLine);