/**
 * Created by DELL on 2017/12/11.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';


class CanvasVideo extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  };
  componentDidMount () {
    this.createCanvas();
    // this.refs.video.onpause = () => {
    //   console.log('暂停了pause');
    //   this.pause_video();
    // };
    // this.refs.video.oncanplaythrough = () => {
    //   console.log('缓冲完毕');
    //   this.drawVideoToCanvas();
    // }
  };
  // 创建canvas
  createCanvas = () => {
    const video = document.getElementById('videoPlayer1234');
    const canvas = document.createElement('canvas'),
      Width = video.clientWidth || 400 / 2,
      Height = video.clientHeight || 711 / 2;
    canvas.width = Width;
    canvas.height = Height;
    this.refs.canvas_video_box.appendChild(canvas);
    this.setState({
      ctx: canvas.getContext('2d'),
      Width,
      Height,
      canvas,
      video
    })
  };

  render() {
    return (
      <div ref='canvas_video_box' className="canvas_video_box"/>
    );
  }
}
export default  connect(state => ({videoTrackList: state.videoTrackList.data, activeDrag: state.activeDrag }), {})(CanvasVideo);