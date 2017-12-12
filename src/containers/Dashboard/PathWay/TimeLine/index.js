/**
 * Created by DELL on 2017/12/6.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {change_needleState} from '@/redux/models/needle';

class TimeLine extends Component {
  constructor(props){
    super(props);
    this.state = {
    };
  }
  changeNeedle = (event) => {
    event.stopPropagation();
    document.getElementById('videoPlayer1234').pause();
    // console.log(event.clientX);
    const left = event.clientX - 60;
    // this.props.changeNeedle(left);
    this.props.change_needleState(left);
    // document.getElementById('videoPlayer1234').currentTime = left;
  };
  render() {
    return (
      <div className="timeLine">
        <div className="time_axis_box">
          <div className="zoom_scale">100%</div>
          <div className="time_axis" onClick={this.changeNeedle} />
        </div>
      </div>
    );
  }
}
export default connect(state => ({}), {change_needleState})(TimeLine);