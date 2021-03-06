/**
 * Created by DELL on 2017/12/11.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';

import TrackVideo from './TrackVideo';
import TrackYt from './TrackYt';

class PathWay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      left: 0,
      activeDrag: '',           // 拖拽类型
      videoTrackList: [         // 所有视频轨道列表
        {type: 'video', child: [{time: '50', start: 10, name: 'video1'}, {time: '60', start: 80, name: 'video2'}]},
        {type: 'video', child: []}],
      audioTrackList: [          // 音频轨道数组
        {type: 'audio', child: []}
      ],
      ytTrackList: [{type: 'text', child: []}, {type: 'text', child: []}],         //  所有压条轨道列表
    };
  }

  componentDidMount() {
    // console.log(this.props.videoTrackList, 'videoTrackList');
  }
  addNewChild_video = (childData, index) => {
    const videoTrackList = [...this.state.videoTrackList];
    const child = {time: '50', start: 200, name: childData.type};
    videoTrackList[index].child.push(child);
    this.setState({
      videoTrackList
    })
  };

  render() {
    const {videoTrackList, activeDrag} = this.props;
    // const {ytTrackList} = this.state;
    return(
      <div className="track_list">
        {/*{*/}
        {/*ytTrackList.map((item, index) => {*/}
        {/*return <TrackYt key={index} type="yt" index={index} activeDrag={activeDrag} item={item}*/}
                        {/*addNewChild={this.addNewChild_video}/>*/}
        {/*})*/}
        {/*}*/}
        {
          videoTrackList.map((item, index) => {
            return <TrackVideo rightBtnTips_show={this.props.rightBtnTips_show} key={index} type="video" trackIndex={index} activeDrag={activeDrag} item={item}/>
          })
        }
        {/*{*/}
        {/*audioTrackList.map((item, index) => {*/}
        {/*return <TrackAudio key={index} index={index} activeDrag={activeDrag} item={item} addNewChild={this.addNewChild_audio} />*/}
        {/*})*/}
        {/*}*/}
      </div>
      )
  }
}
export default connect(state => ({videoTrackList: state.videoTrackList.data, activeDrag: state.activeDrag}))(PathWay);