/**
 * Created by DELL on 2017/12/5.
 */
/**
 * Created by DELL on 2017/12/5.
 */
import React, {Component} from 'react';
import VideoItem from './VideoItem';
import { connect } from 'react-redux';
import {videoTrackList_add} from '@/redux/models/videoTrackList';
import {active_element_change} from '@/redux/models/activeTruckElement';

class TrackVideo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'video'
    };
  }
  componentDidMount () {
   // console.log(this.props);
  }
  _dragover = (event) => {
    const {item, activeDrag} = this.props;
    let isActiveDrag = false;
    if (item.type === activeDrag) {
      isActiveDrag = true;
    }
    if (isActiveDrag) {
      event.preventDefault();
    }
  }
  _drop = (event) => {
    const left = event.clientX - 60;
    event.preventDefault();
    const dropData = JSON.parse(event.dataTransfer.getData("data"));
    dropData.start = left;
    // dropData.time = 100;

    this.props.videoTrackList_add(dropData, this.props.index);
  }

  render() {
    const {item, activeDrag} = this.props;   // item 每一条轨道对象的数组
    let isActiveDrag = false;
    if (item.type === activeDrag) {
      isActiveDrag = true;
    }
    const {child = []} = item;
    return (
      <div className="track Video">
        <div className='track_type'>{item.type}</div>
        <div className={isActiveDrag ? 'track_body activeDrag' : 'track_body'} onDragOver={this._dragover} onDrop={this._drop} ref='drop'>
          {child.map((itemData, index) => {
            return <VideoItem key={index} itemData={itemData} itemIndex={index} trunkIndex={this.props.index} />

            // <div className="element_obj" style={{width: `${childItem.time}px`, left: `${childItem.start}px`}} key={index} onClick={this.activeTruckElement.bind(this, index)}>
            //   <div>{childItem.name}</div>
            // </div>
          })}
        </div>
      </div>
    )
  }
}
export default  connect(state => ({admin: state.admin, activeElement: state.activeElement}),
  {videoTrackList_add,
  active_element_change})(TrackVideo);