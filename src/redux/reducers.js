/**
 * Created by DELL on 2017/11/14.
 */
import { combineReducers } from 'redux'

import admin from './models/admin';
import other from './models/other';
import videoTrackList from './models/videoTrackList';  // video轨道
import activeDrag from './models/dragActive';  // 拖拽的类型
import activeElement from './models/activeTruckElement';  // 轨道激活元素
import needle from './models/needle';  // 指针
import zoom_scale from './models/zoomScale';  // 缩放比例
import current_playing_video from './models/cutVideo/currentPlayingVideo';  // 缩放比例
import pointInOut from './models/cutVideo/pointInOut';  // 缩放比例
import pathWayWidth from './models/cutVideo/pathWayWidth';  // 缩放比例

// reducer 就是一个纯函数，接收旧的 state 和 action，返回新的 state。

// const other = (state = 0, action) => {
//   switch (action.type) {
//     case 'ADD':
//       return state + 1;
//     default :
//       return state
//   }
// };

// 用户
// const user = (state = {}, action) => {
//   switch (action.type) {
//     case 'LOGIN' :
//       return {username: '王小二'};
//     default :
//       return state
//   }
// };
/*
reducer首先用action中传入的type属性来判断我们要做的是哪种操作，
然后再根据传入的其他属性当做参数做你想要的改变，最后返回一个{key : value}的对象，
然后所有类似的对象通过combineReducers合并为一个总状态对象暴露给组件访问。
*/

const reducers = combineReducers({
  other,
  admin,
  videoTrackList,
  activeDrag,
  activeElement,
  needle,
  zoom_scale,
  pointInOut,
  current_playing_video,
  pathWayWidth
  // more state
});

export default reducers;