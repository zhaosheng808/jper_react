/**
 * Created by DELL on 2017/12/6.
 */
import React, { Component } from 'react';
import './inOut.css';

export default
class InOut extends Component {
  constructor(props){
    super(props);
    this.state = {
      in_left: 40,
      out_left: 80,
      in_show: true,
      out_show: true,
    };
  }
  needle_move = () => {
    const { left } = this.state;
    this.setState({
      left: left + 1
    })
  }
  render() {
    const {in_left, out_left, in_show, out_show} = this.state;
    return (
      <div className="in_out">
        <div className="inPoint" style={{display: in_show ? 'block' : 'none', left: `${in_left}px`}} />
        <div className="outPoint" style={{display: out_show ? 'block' : 'none', left: `${out_left}px`}} />
      </div>
    );
  }
}