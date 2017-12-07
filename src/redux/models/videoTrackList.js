/**
 * Created by DELL on 2017/12/7.
 */
export const LOGIN = 'LOGIN';
export const ADD_NEW_CHILD = 'ADD_NEW_CHILD';

const defaultState = {
  name: 'videoTrackList',
  data: [         // 所有视频轨道列表
    {type: 'video' , child: [{time: '50', start: 10, name: 'video1'},{time: '60', start: 80, name: 'video3'}]},
    {type: 'video', child: []}
    ]
};

export default function reduce (state = defaultState, action = {}) {
  switch (action.type) {
    case 'ADD_NEW_CHILD' :
      const newState = {...state};
      const {index, trackData} = action.data;
      newState.data[index].child.push({
        time: trackData.time,
        start: trackData.start,
        name: trackData.name
      });
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
export const videoTrackList_add = (trackData, index) => {
  return {
    type: ADD_NEW_CHILD,
    data: {
      trackData,
      index
    }
  }
};