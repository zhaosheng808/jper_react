/**
 * Created by DELL on 2017/12/5.
 */
import React, { Component } from 'react';
import './pathWay.css';
import TrackYt from './TrackYt';
import TrackVideo from './TrackVideo';
import TrackAudio from './TrackAudio';

export default
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
    const {activeDrag, ytTrackList , videoTrackList, audioTrackList} = this.state;
    return (
      <div className="pathWay">
       <div className="pathWay_inner">
         <div className="track_list">
           {
             ytTrackList.map((item, index) => {
               return <TrackYt key={index} index={index} activeDrag={activeDrag} item={item}/>
             })
           }
           {
             videoTrackList.map((item, index) => {
               return <TrackVideo key={index} index={index} activeDrag={activeDrag} item={item} addNewChild={this.addNewChild_video} />
             })
           }
           {
             audioTrackList.map((item, index) => {
               return <TrackAudio key={index} index={index} activeDrag={activeDrag} item={item} addNewChild={this.addNewChild_audio} />
             })
           }
         </div>
       </div>
      </div>
    );
  }
}