import React, {Component} from 'react';
import './index.css'

export default class TimeDisplayText extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: this.props.second,
      displayArray: []
    }
  }

  componentDidMount() {
    this.state.displayArray = this.parseSecond2Str(this.state.time);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({displayArray: this.parseSecond2Str(nextProps.second)});
  }

  parseSecond2Str = (seconds) => {
    var secondIntValue = parseInt(seconds);
    var miniSecond = parseInt(Math.round((seconds - secondIntValue) * 100));
    var array = this.parseInt2Array(miniSecond, 2);
    var spliter = ':';
    var spiteArray = [spliter];
    var value = secondIntValue;
    for (var a = 0; a < 3; a++) {
      var leftValue = value % 60;
      value = (value - leftValue) / 60;
      var currentArray = this.parseInt2Array(leftValue, 2);
      array = currentArray.concat(spiteArray).concat(array);
    }
    var firstIndexNotZero = array.findIndex(q => q != spliter && q != 0);
    if(firstIndexNotZero=== -1){
      firstIndexNotZero = array.length;
    }
    var result = array.map((q, key) => {
      return {num: q, isColorBlack: key >= firstIndexNotZero};
    });
    return result;
  }
  parseInt2Array = (value, length) => {
    var result = [];
    for (var a = 0; a < length; a++) {
      var leftValue = value % 10;
      result.unshift(leftValue);
      value = (value - leftValue) / 10;
    }
    return result;
  }


  render() {
    return (
      <div className="two_color">
        {
          this.state.displayArray.map((item, key) => {
            return <span key={key} style={{color: item.isColorBlack ? '#ffc000' : '#383838'}}>{item.num}</span>
          })
        }
      </div>
    )
  }

}