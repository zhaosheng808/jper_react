/**
 * Created by DELL on 2017/12/5.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import './pathWay.css';
// import TrackYt from './TrackYt';

import TimeLine  from './TimeLine';
import InOut  from './InOut';
import RightBtnTips from '@/components/RightBtnTips';
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
  };


  //  打开右键提示
  rightBtnTips_show = (left, top, del_fun) => {
    this.refs.rightBtnTips.show(left, top, del_fun);
  };
  render() {
    // const {ytTrackList , audioTrackList} = this.state;
    const {pathWayWidth} = this.props;
    return (
      <div className="pathWay_wrapper" onMouseDown={this._clip_mouseDown}>
       <div className="pathWay">
         <div className="pathWay_inner" style={{width: pathWayWidth}}>
           <TimeLine changeNeedle={this.changeNeedle} ref='timeLine'/>
           <Needle ref='needle'/>
           <InOut />
           <TrackList rightBtnTips_show={this.rightBtnTips_show} />
         </div>
         <RightBtnTips ref="rightBtnTips" />
       </div>
      </div>
    );
  }
}
export default connect(state => (
  {
    videoTrackList: state.videoTrackList.data,
    pathWayWidth: state.pathWayWidth.width,
    activeDrag: state.activeDrag
  }))(PathWay);