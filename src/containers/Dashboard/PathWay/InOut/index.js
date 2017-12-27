/**
 * Created by DELL on 2017/12/6.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import './inOut.css';

class InOut extends Component {
  constructor(props){
    super(props);
    this.state = {

    };
  }
  render() {
    const {pointInOut, zoom_scale} = this.props;
    const {inPoint, outPoint} = pointInOut;
    const inoutCover_width = (outPoint.time - inPoint.time) * zoom_scale;
    return (
      <div className="in_out">
        <div className="inPoint" style={{display: inPoint.isShow ? 'block' : 'none', left: `${inPoint.time * zoom_scale}px`}} />
        <div className="outPoint" style={{display: outPoint.isShow ? 'block' : 'none', left: `${outPoint.time * zoom_scale}px`}} />
        <div className="inout_cover" style={{width: `${inoutCover_width}px`, left: `${inPoint.time * zoom_scale}px`}} />
      </div>
    );
  }
}
export default connect(state => ({
    pointInOut: state.pointInOut,
    zoom_scale: state.zoom_scale.scale
  }),
  {}
)(InOut);