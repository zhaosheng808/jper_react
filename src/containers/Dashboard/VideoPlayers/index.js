/**
 * Created by DELL on 2017/12/11.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import VideoPlayerItem from './VideoPlayerItem';
import './videoPlayer.css';

class VideoPlayers extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount () {

  };

  render() {
    return (
      <div className="videoPlayers_wrapper">
        <VideoPlayerItem/>
      </div>
    );
  }
}
export default  connect(state => ({videoTrackList: state.videoTrackList.data, activeDrag: state.activeDrag }), {})(VideoPlayers);