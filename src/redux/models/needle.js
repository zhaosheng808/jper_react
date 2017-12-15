/**
 * Created by DELL on 2017/12/8.
 * 指针状态 当前位置，是否播放
 */
export const CHANGE_NEEDLE_POSITION = 'CHANGE_NEEDLE_POSITION';
export const CHANGE_NEEDLE_STATE = 'CHANGE_NEEDLE_STATE';

const defaultState = {
  currentTime: 0,
  isMoving: false
};

export default function reduce (state = defaultState, action = {}) {
  switch (action.type) {
    case 'CHANGE_NEEDLE_POSITION' :
      return {...state, currentTime: action.data};
    case 'CHANGE_NEEDLE_STATE' :
      return {...state, ...action.data};
    default :
      return state
  }
}

export const change_needlePosition = (data) => {
  return {
    type: CHANGE_NEEDLE_POSITION,
    data
  }
};
export const change_needleState = (data) => {
  return {
    type: CHANGE_NEEDLE_STATE,
    data
  }
};