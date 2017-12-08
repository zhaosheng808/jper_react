/**
 * Created by DELL on 2017/12/8.
 */
/*
* 轨道缩放比例
* default video 1s -> 轨道 10px
* */
export const CHANGE_ZOOM_STATE = 'CHANGE_ZOOM_STATE';

const defaultState = {
  scale: 10,
};

export default function reduce (state = defaultState, action = {}) {
  switch (action.type) {
    case 'CHANGE_ZOOM_STATE' :
      return {scale: action.data};
    default :
      return state
  }
}