/**
 * Created by DELL on 2017/12/5.
 */
/**
 * Created by DELL on 2017/12/5.
 */
import React, {Component} from 'react';


export default
class TrackAudio extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    event.preventDefault();
    const dropData = JSON.parse(event.dataTransfer.getData("data"));
    this.props.addNewChild(dropData, this.props.index);
    // this.refs.drop.innerHTML = `<div class="drug">${dropData.type}</div>`;
  }
  showMessage = (itemObject, scope) => {
    console.log(itemObject);
  }

  render() {
    const {item, activeDrag} = this.props;   // item 每一条轨道对象的数组
    let isActiveDrag = false;
    if (item.type === activeDrag) {
      isActiveDrag = true;
    }
    const {child = []} = item;
    return (
      <div className="track Audio">
        <div className='track_type'>{item.type}</div>
        <div className={isActiveDrag ? 'track_body activeDrag' : 'track_body'} onDragOver={this._dragover} onDrop={this._drop} ref='drop'>
          {child.map((childItem, index) => {
            return <div className="element_obj" onClick={this.showMessage.bind(this, childItem)} style={{width: `${childItem.time}px`}} key={index}>
              <div>{childItem.name}</div>
            </div>
          })}
        </div>
      </div>
    )
  }
}