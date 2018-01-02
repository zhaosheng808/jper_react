/**
 * Created by DELL on 2017/12/6.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import tools from '@/utils/tools';
import {change_needlePosition, change_needleState} from '@/redux/models/needle';
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
      //秒转化成 时分秒
      timeArr.push(tools.secondToDate(i));
    }
    this.setState({
      timeArr
    })
  };
  windows_resize = () => {
    this.initTimeArr();
  };


  changeNeedle = (event) => {
    event.stopPropagation();
    const {zoom_scale} = this.props;
    this.props.change_needleState({isMoving: false});
    const pathWay_scrollLeft = document.querySelector('.pathWay').scrollLeft;
    const App_scrollLeft = document.querySelector('.App').scrollLeft;


    const left = event.clientX - 64 + pathWay_scrollLeft + App_scrollLeft;

    // let playIngVideo = {};
    // if (videoTrackList[current_playing_video.trackIndex]) {
    //   playIngVideo = videoTrackList[current_playing_video.trackIndex].child[current_playing_video.itemIndex];
    // }
    // if (playIngVideo.playerId) {
    //   const videoPlayer = document.getElementById(playIngVideo.playerId);
    //   // 将video的当前播放时间置为当前指针位置
    //
    //   if (!videoPlayer.paused) {
    //     // videoPlayer.pause();
    //   }
    // }

    const needleTime = left / zoom_scale * 1000;
    this.props.change_needlePosition(needleTime);
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
            return <span className="timeSecond highLight" key={index} style={{marginRight: `${(3 * zoom_scale) - 1 }px`}}><i>{item}</i></span>
          } else if (index % 3 === 0) {
            return <span className="timeSecond" key={index} style={{marginRight: `${(3 * zoom_scale) - 1 }px`}}/>
          }
        } else if (zoom_scale > 2){
          if (index % 60 === 0) {
            return <span className="timeSecond highLight" key={index} style={{marginRight: `${(4 * zoom_scale) - 1 }px`}}><i>{item}</i></span>
          } else if (index % 4 === 0) {
            return <span className="timeSecond" key={index} style={{marginRight: `${(4 * zoom_scale) - 1 }px`}}/>
          }
        } else if (zoom_scale > 1){
          if (index % 120 === 0) {
            return <span className="timeSecond highLight" key={index} style={{marginRight: `${(12 * zoom_scale) - 1 }px`}}><i>{item}</i></span>
          } else if (index % 12 === 0){
            return <span className="timeSecond" key={index} style={{marginRight: `${(12 * zoom_scale) - 1 }px`}}/>
          }
        } else if (zoom_scale > 0.5){
          if (index % 240 === 0) {
            return <span className="timeSecond highLight" key={index} style={{marginRight: `${(24 * zoom_scale) - 1 }px`}}><i>{item}</i></span>
          } else if (index % 24 === 0) {
            return <span className="timeSecond" key={index} style={{marginRight: `${(24 * zoom_scale) - 1 }px`}}/>
          }
        }else if (zoom_scale > 0.3){
          if (index % 360 === 0) {
            return <span className="timeSecond highLight" key={index} style={{marginRight: `${(60 * zoom_scale) - 1 }px`}}><i>{item}</i></span>
          } else if (index % 60 === 0){
            return <span className="timeSecond" key={index} style={{marginRight: `${(60 * zoom_scale) - 1 }px`}}/>
          }
        }else if (zoom_scale > 0.2){
          if (index % 360 === 0) {
            return <span className="timeSecond highLight" key={index} style={{marginRight: `${(120 * zoom_scale) - 1 }px`}}><i>{item}</i></span>
          } else if (index % 120 === 0){
            return <span className="timeSecond" key={index} style={{marginRight: `${(120 * zoom_scale) - 1 }px`}}/>
          }
        }
        else if (zoom_scale > 0.1){
          if (index % 900 === 0) {
            return <span className="timeSecond highLight" key={index} style={{marginRight: `${(120 * zoom_scale) - 1 }px`}}><i>{item}</i></span>
          } else if (index % 120 === 0){
            return <span className="timeSecond" key={index} style={{marginRight: `${(120 * zoom_scale) - 1 }px`}}/>
          }
        }else if (zoom_scale > 0){
          if (index % 3600 === 0) {
            return <span className="timeSecond highLight" key={index} style={{marginRight: `${(600 * zoom_scale) - 1 }px`}}><i>{item}</i></span>
          } else if (index % 600 === 0){
            return <span className="timeSecond" key={index} style={{marginRight: `${(600 * zoom_scale) - 1 }px`}}/>
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
  videoTrackList: state.videoTrackList.data,
  pathWayWidth: state.pathWayWidth.width,
  zoom_scale: state.zoom_scale.scale
}), {
  change_needlePosition,
  change_needleState
})(TimeLine);