/**
 * Created by DELL on 2017/12/7.
 */
export const CHANGE_VIDEO_STATE = 'CHANGE_VIDEO_STATE';

const defaultState = {
  isPlay: false,
  currentTime: 0,
};

export default function reduce (state = defaultState, action = {}) {
  switch (action.type) {
    case 'CHANGE_VIDEO_STATE' :
      return state.assign(action.data);
    default :
      return state
  }
}

export const change_videoState = (data) => {
  return {
    type: CHANGE_VIDEO_STATE,
    data
  }
};