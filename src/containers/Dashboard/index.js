/**
 * Created by DELL on 2017/11/10.
 */
import React, {Component} from 'react';
import { connect } from 'react-redux';
import {change_needlePosition} from '@/redux/models/needle';
// import logo from '../../logo.svg';
import Header  from './Header';
import File  from './File';
import CanvasVideo  from './CanvasVideo';
import VideoPlayers  from './VideoPlayers';
import ToolBar  from './ToolBar';

// import Needle  from './Needle';
import PathWay  from './PathWay';

import OperateMessage  from './OperateMessage';
import './dashboard.css';
// import mp4 from '@/assets/media/VID_20171123_124935.mp4';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canvas: null,
      ctx: null,
      Width: '',
      Height: '',
      video: '',
      app_operation_height: '',      // app_operation height
      timer: null                   // 定时器
    };
  }

  componentDidMount() {
    this.windows_resize();
    window.onresize = () => {
      this.windows_resize()
    };
    const speechSU = new window.SpeechSynthesisUtterance();
    speechSU.text = 'hello world!';
    window.speechSynthesis.speak(speechSU);
  }
  componentWillUnmount () {
    window.onresize = () => {
    };
  };

  windows_resize = () => {
    const app_panel_height = this.refs.app_panel.clientHeight;
    const app_operation_height = `calc(100% - ${app_panel_height + 1}px)`;
    this.setState({
      app_operation_height
    })
  };

  render() {
    const {app_operation_height} = this.state;
    return (
      <div className="dashboard">
        <Header />
        <div className="app_body">
          {/*<!-- 信息展示-->*/}
          <div className="app_panel" ref='app_panel'>
            {/*<!--具体操作信息展示-->*/}
            <div className="right_panel">
              <OperateMessage/>
            </div>
            <div className="left_panel clear">
              {/*<!--文件展示-->*/}
              <File changeActiveDrag={this.changeActiveDrag}/>
              {/*<!--video展示-->*/}
              <CanvasVideo />
                {/*<div ref='canvas_video_box' className="canvas_video_box"/>*/}
            </div>
          </div>
          {/*<!-- 操作区域-->*/}
          <div className="app_operation" style={{height: app_operation_height}}>
            <ToolBar/>
            {/*<!-- 操作面板-->*/}
            {/*<!-- 轨道-->*/}
            <PathWay ref='pathWay'/>
          </div>
        </div>
        <VideoPlayers/>
      </div>
    );
  }
}

export default connect(state => ({needleLeft: state.needle.currentTime, videoTrackList: state.videoTrackList.data, zoom_scale: state.zoom_scale.scale}),
  {change_needlePosition})(Dashboard);
