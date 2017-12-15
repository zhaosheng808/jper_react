/**
 * Created by DELL on 2017/12/11.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import VideoPlayerItem from './VideoPlayerItem';
import './videoPlayer.css';
import defaultImg from '@/assets/other/example.png';

class VideoPlayers extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount () {

  };

  render() {
    const {videoTrackList = []} = this.props;
    console.log(videoTrackList, 'videoTrackList');
    const videoArray = [];
    videoTrackList.forEach((item, index) => {
      if (item.child) {
        item.child.forEach((childItem, childIndex) => {
          videoArray.push(childItem);
        })
      }
    });
    return (
      <div className="videoPlayers_wrapper">
        <img src={defaultImg} id="defaultImg"/>
        {
          videoArray.map((item, index) => {
            return <VideoPlayerItem key={index} itemData={item} />
          })
        }
      </div>
    );
  }
}
export default connect(state => ({videoTrackList: state.videoTrackList.data}), {})(VideoPlayers);