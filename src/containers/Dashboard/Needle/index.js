/**
 * Created by DELL on 2017/12/6.
 */
import React, { Component } from 'react';

export default
class Needle extends Component {
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
  changeNeedle = (left) => {
    this.setState({
      left: left + 1
    })
  }
  render() {
    const {left} = this.state;
    return (
      <div className="needle" style={{'left': `${left}px`}}/>
    );
  }
}