/**
 * Created by DELL on 2017/12/6.
 */
import React, { Component } from 'react';

import tools from '@/utils/tools';

export default
class Needle extends Component {
  constructor(props){
    super(props);
    this.state = {
      left: 0,
      isMoseDown: false,
      startX: 0
    };
  }
  componentDidMount () {
    tools.addEventHandler(document.body, 'mouseup', this.needle_mouseUp);
  }
  needle_move = () => {
    const { left, isMoseDown } = this.state;
    if(!isMoseDown) {
      this.setState({
        left: left + 1
      })
    }
  }
  changeNeedle = (left) => {
    this.setState({
      left: left + 1
    })
  };
  needle_mouseMove = (event) => {
    tools.addEventHandler(document.body, 'mousemove', this.changechangeNeedle_move);
  };
  changechangeNeedle_move = (event) => {
    const {startX, startLeft} = this.state;
    const endX = event.clientX;
    const moveX =  endX - startX;
    let nowLeft = startLeft + moveX;
    if (nowLeft < 0) {
      nowLeft = 0
    }
    this.setState({
      left: nowLeft
    })
  };
  needle_mouseDown = (event) => {
    const {left} = this.state;
    this.setState({
      startX: event.clientX,
      startLeft: left,
      isMoseDown: true
    });
    this.needle_mouseMove();
  };
  needle_mouseUp = () => {
    tools.removeEventHandler(document.body, 'mousemove', this.changechangeNeedle_move);
    this.setState({
      isMoseDown: false
    })
  };
  render() {
    const {left} = this.state;
    return (
      <div className="needle" ref='needle' onMouseDown={this.needle_mouseDown.bind(this)} style={{'left': `${left}px`}}/>
    );
  }
}