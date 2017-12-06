/**
 * Created by DELL on 2017/12/5.
 */
import React, { Component } from 'react';
import './pathWay.css';
import Pathway from './PathWayItem';

export default
class PathWay extends Component {
  constructor(props){
    super(props);
    this.state = {
      left: 0,
      activeDrag: '',   // 拖拽类型
      pathWay: [
        {type: 'text'},
        {type: 'video'},
        {type: 'video'},
        {type: 'audio'},
      ]
    };
  }
  needle_move = () => {
    const {left} = this.state;
    this.setState({
      left: left + 1
    })
  }
  changeActiveDrag = (type) => {
    this.setState({
      activeDrag: type
    })
  }
  render() {
    const {left, pathWay, activeDrag} = this.state;
    return (
      <div className="pathWay">
       <div className="time_axis_box">
         <div className="zoom_scale">100%</div>
         <div className="time_axis">
           <div className="needle" style={{'left': `${left}px`}}/>
         </div>
       </div>
        {pathWay.map((item, index) => {
          return <Pathway key={index} activeDrag={activeDrag} item={item}/>
        })
        }
      </div>
    );
  }
}