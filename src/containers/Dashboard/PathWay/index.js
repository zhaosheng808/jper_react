/**
 * Created by DELL on 2017/12/5.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import './pathWay.css';
// import TrackYt from './TrackYt';

import TimeLine  from './TimeLine';
import InOut  from './InOut';
// import TrackAudio from './TrackAudio';
import Needle  from './Needle';
import TrackList  from './TrackList';
class PathWay extends Component {
  constructor(props){
    super(props);
    this.state = {
      left: 0,
      activeDrag: '',           // 拖拽类型
      videoTrackList: [         // 所有视频轨道列表
        {type: 'video' , child: [{time: '50', start: 10, name: 'video1'},{time: '60', start: 80, name: 'video2'}]},
        {type: 'video', child: []} ],
      audioTrackList: [          // 音频轨道数组
        {type: 'audio', child: []}
        ],
      ytTrackList: [{type: 'text', child: []}],         //  所有压条轨道列表
    };
  }
  componentDidMount () {
    // console.log(this.props.videoTrackList, 'videoTrackList');
  }
  changeActiveDrag = (type) => {
    this.setState({
      activeDrag: type
    })
  }
  addNewChild_video = (childData, index) => {
    console.log(childData);
    const videoTrackList = [...this.state.videoTrackList];
    const child = {time: '50', start: 200, name: childData.type};
    videoTrackList[index].child.push(child);
    console.log(videoTrackList, 'videoTrackList')
    this.setState({
      videoTrackList
    })
  }
  addNewChild_audio = (childData, index) => {
    console.log(childData);
    const audioTrackList = [...this.state.audioTrackList];
    const child = {time: '50', start: 200, name: childData.type};
    if (!audioTrackList[index].child) {
      audioTrackList[index].child = [];
    }
    audioTrackList[index].child.push(child);
    console.log(audioTrackList, 'videoTrackList');
    this.setState({
      audioTrackList
    })
  }
  render() {
    // const {ytTrackList , audioTrackList} = this.state;

    return (
      <div className="pathWay">
       <div className="pathWay_inner">
         <TimeLine changeNeedle={this.changeNeedle} ref='timeLine'/>
         <Needle ref='needle'/>
         <InOut />
         <TrackList />

       </div>
      </div>
    );
  }
}
export default connect(state => ({videoTrackList: state.videoTrackList.data, activeDrag: state.activeDrag }))(PathWay);