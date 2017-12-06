/**
 * Created by DELL on 2017/12/5.
 */
/**
 * Created by DELL on 2017/12/5.
 */
import React, {Component} from 'react';


export default
class PathWayItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      left: 0,
      pathWay: [
        {type: 'text'},
        {type: 'video'},
        {type: 'video'},
        {type: 'audio'},
      ]
    };
  }
  componentDidMount () {
   // console.log(this.props);
  }
  needle_move = () => {
    const {left} = this.state;
    this.setState({
      left: left + 1
    })
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
    console.log(event);
    event.preventDefault();
    console.log(JSON.parse(event.dataTransfer.getData("data")), 'data');
    this.refs.drop.innerHTML = '<div class="drug">123</div>'
  }

  render() {
    const {item, activeDrag} = this.props;
    let isActiveDrag = false;
    if (item.type === activeDrag) {
      isActiveDrag = true;
    }
    return (
      <div className="video_pathWay pathWay_item">
        <div className='pathWay_type'>{item.type}</div>
        <div className={isActiveDrag ? 'pathWay_item_body activeDrag' : 'pathWay_item_body'} onDragOver={this._dragover} onDrop={this._drop} ref='drop'/>
      </div>
    )
  }
}