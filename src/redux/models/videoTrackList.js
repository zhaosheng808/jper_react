/**
 * Created by DELL on 2017/12/7.
 */
import tools from '@/utils/tools';

export const LOGIN = 'LOGIN';
export const ADD_NEW_CHILD = 'ADD_NEW_CHILD';
export const DEL_CHILD = 'DEL_CHILD';
export const ADD_TRACK = 'ADD_TRACK';
export const DEL_TRACK = 'DEL_TRACK';
export const EDIT_TRACK = 'EDIT_TRACK';

const defaultState = {
  name: 'videoTrackList',
  data: [         // 所有视频轨道列表
    {type: 'video' , level: 0, isVisible: true, child: [
      {
        id: '1234',                                         // id               id为当前时间戳
        type: 'video',
        playerId: 'playerId' + 1234,                // video播放器       播放器id格式 -- playerId + 时间戳
        src: 'http://toutiao-cdn-jper.foundao.com/ovesystem/data/material/2017/09/07/ymzcut_11709540701101010818201_04bf9d04b5ff80ab2656093b6e4f2617.mp4',                                                   // src              视频源
        cover: '',                                                 // cover            封面
        title: 'video01',                                                 // title            描述
        origin_time: 8,                                           // origin_time      原video时间
        start_time: 4,                                            // start_time       当前视频的起始时间，相对于轨道
        time: 8,                                     // time             当前视频的时间长度
        relative_start: 0,                                     // relative_start   裁剪视频的起始时间相对于原视频的起始时间
        width: '',                                                 // 视频宽度
        height: '',                                                // 视频高度
        volume: 1,                                             // 视频音量
        speed: 1,                                              // 播放速度
        filter: '',                                            // 滤镜类型
        cutType: '',                                           // 转场类型
        cutTime: '',                                           // 转场时间
        voice_in_time: '',                                     // 音频淡入时间
        voice_out_time: '',                                    // 音频淡出时间
      }
      ]},
    {type: 'video', isVisible: true, level: 1, child: []}
    ]
};

export default function reduce (state = defaultState, action = {}) {
  const newState = tools.deepClone(state);
  let trackIndex = 0, itemIndex = 0, itemData = {};
  if (action.data) {
    trackIndex = action.data.trackIndex;
    itemIndex = action.data.itemIndex;
    itemData = action.data.itemData;
  }
  switch (action.type) {
    case 'ADD_NEW_CHILD' :
      const {trackItemData} = action.data;
      newState.data[trackIndex].child.push(trackItemData);
      return newState;
    case 'DEL_CHILD' :
      newState.data[trackIndex].child.splice(itemIndex, 1);
      return newState;
    case 'ADD_TRACK' :
      newState.data.push({type: 'video', isVisible: true, level: state.data.length, child: []});
      return newState;
    case 'DEL_TRACK' :
      newState.data.splice(trackIndex, 1);
      return newState;
    case 'EDIT_TRACK':
      newState.data[trackIndex].child.splice(itemIndex, 1, itemData);
      return newState;
    default :
      return state
  }
}

// 新增轨道
export const videoTrack_add = (trackIndex) => {
  return {
    type: ADD_TRACK,
    data: {
      trackIndex
    }
  }
};

// 删除轨道
export const videoTrack_del = (trackIndex) => {
  return {
    type: DEL_TRACK,
    data: {
      trackIndex
    }
  }
};

// 添加新的轨道内元素
export const videoTrackList_add = (trackItemData, trackIndex) => {
  return {
    type: ADD_NEW_CHILD,
    data: {
      trackItemData,
      trackIndex
    }
  }
};

// 删除指定的轨道内元素
export const videoTrackList_del = (trackIndex, itemIndex) => {
  return {
    type: DEL_CHILD,
    data: {
      trackIndex, itemIndex
    }
  }
};

// 修改指定轨道内的元素属性
export const videoTrack_edit = (trackIndex, itemIndex, itemData) => {
  return {
    type: EDIT_TRACK,
    data: {
      trackIndex,
      itemIndex,
      itemData
    }
  }
};