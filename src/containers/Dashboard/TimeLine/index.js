/**
 * Created by DELL on 2017/12/6.
 */
import React, { Component } from 'react';

export default
class TimeLine extends Component {
  constructor(props){
    super(props);
    this.state = {
      left: 0
    };
  }
  needle_move = () => {
    const { left } = this.state;
    this.setState({
      left: left + 1
    })
  }
  changeNeedle = (event) => {
    event.stopPropagation();
    console.log(event.clientX);
    const left = event.clientX - 60;
    this.props.changeNeedle(left);
  }
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