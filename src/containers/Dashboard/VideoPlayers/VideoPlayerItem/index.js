/**
 * Created by DELL on 2017/12/11.
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {change_needleState} from '@/redux/models/needle';


class VodeoPlayerItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canvas: null,
      ctx: null,
      timer: null,      // 定时器
    };
  }

  componentDidMount() {
    this.getCanvas();
    this.refs.video.onpause = () => {
      console.log('暂停了pause');
      this.pause_video();
    };
    this.refs.video.oncanplaythrough = () => {
      console.log('缓冲完毕');
      this.drawVideoToCanvas();
    };
    this.refs.video.onplay = () => {
      this.play_video();
    }
  };
  getCanvas = () => {
    const canvas = document.getElementsByClassName('video_panel')[0].getElementsByTagName('canvas')[0];
    const ctx = canvas.getContext('2d');
    this.setState({
      canvas,
      ctx
    })
  };
  // play
  play_video = () => {
    // this.refs.video.play();
    this.startInterval();
    this.time_add();
    this.refs.video.ontimeupdate = (e) => {
      // console.log(e, 'e');
      // this.time_add();
    }
  };
  // 轮询
  startInterval = () => {
    let {timer} = this.state;
    if (!timer) {
      timer = setInterval(() => {
        this.time_add();
      }, 100);
      this.setState({
        timer
      })
    }
  };
  // pause
  pause_video = () => {
    this.refs.video.pause();
    // document.getElementById('video').pause();
    this.stopInterval();
  };
  // 暂停
  stopInterval = () => {
    const {timer} = this.state;
    clearInterval(timer);
    this.setState({
      timer: null
    })
  };
  // 轮询时间增加
  time_add = () => {
    this.needle_move();
    this.drawVideoToCanvas();
  };
  // 指针移动
  needle_move = () => {
    const {needleLeft, zoom_scale} = this.props;
    this.props.change_needleState(needleLeft + 1);
    const {videoTrackList, } = this.props; // video轨道对象
    const needleLeft_now = needleLeft;
    videoTrackList.forEach((item, index) => {
      if (item.child) {
        item.child.forEach((childItem, childIndex) => {
          console.log(childItem, 'childItem');
          const videoPlayer = document.getElementById('');
          const {start, time} = childItem;
          if (needleLeft_now >= start * zoom_scale && needleLeft_now <= parseFloat(start * zoom_scale) + parseFloat(time * zoom_scale)) {
            console.log((needleLeft_now - start * zoom_scale) / zoom_scale , '播放时间-->name  __ ', childItem.name);
            this.refs.video.play();
          } else {
            // this.refs.video.pause();
          }
        })
      }
    })
  };

  // 点击改变指针位置
  changeNeedle = (left) => {

    this.props.change_needleState(left);
  };
  // 定时将video画在画布上
  drawVideoToCanvas = () => {
    const {ctx, Width, Height} = this.state;
    const video = this.refs.video;
    ctx.drawImage(video, 0, 0, Width, Height);
  };

  render() {
    const {itemData} = this.props;
    console.log(itemData, 'itemDataVideo');
    return (
      <div className="video_wrapper">
        <video ref='video' controls preload="true" id={itemData.videoPlayer} src={itemData.src}>你的播放器不支持video</video>
      </div>
    );
  }
}

export default connect(state => ({
  videoTrackList: state.videoTrackList.data,
  needleLeft: state.needle.currentTime,
  zoom_scale: state.zoom_scale.scale

}), {change_needleState})(VodeoPlayerItem);