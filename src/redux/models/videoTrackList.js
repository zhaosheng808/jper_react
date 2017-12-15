/**
 * Created by DELL on 2017/12/7.
 */
import tools from '@/utils/tools';
console.log(tools);
export const LOGIN = 'LOGIN';
export const ADD_NEW_CHILD = 'ADD_NEW_CHILD';

const defaultState = {
  name: 'videoTrackList',
  data: [         // 所有视频轨道列表
    {type: 'video' , level: 0, isVisible: true, child: [
      {
        id: '1234',                                         // id               id为当前时间戳
        playerId: 'playerId' + 1234,                // video播放器       播放器id格式 -- playerId + 时间戳
        src: 'http://toutiao-cdn-jper.foundao.com/ovesystem/data/material/2017/09/07/ymzcut_11709540701101010818201_04bf9d04b5ff80ab2656093b6e4f2617.mp4',                                                   // src              视频源
        cover: '',                                                 // cover            封面
        title: 'video01',                                                 // title            描述
        origin_time: '',                                           // origin_time      原video时间
        start_time: 10,                                            // start_time       当前视频的起始时间，相对于轨道
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
  switch (action.type) {
    case 'ADD_NEW_CHILD' :
      const newState = tools.deepClone(state);
      const {index, trackItemData} = action.data;
      newState.data[index].child.push(trackItemData);
      console.log(state, 'state');
      console.log(newState, 'newState__video_truck');
      return newState;
    default :
      return state
  }
}
export const videoTrackList_change = () => {
  return {
    type: LOGIN
  }
};
export const videoTrackList_add = (trackItemData, index) => {
  return {
    type: ADD_NEW_CHILD,
    data: {
      trackItemData,
      index
    }
  }
};