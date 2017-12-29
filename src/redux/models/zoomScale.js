/**
 * Created by DELL on 2017/12/8.
 */
/*
* 轨道缩放比例
* default video 1s -> 轨道 10px
* */
export const CHANGE_ZOOM_SCALE = 'CHANGE_ZOOM_SCALE';

const defaultState = {
  scale: 0.5,
};

export default function reduce (state = defaultState, action = {}) {
  switch (action.type) {
    case 'CHANGE_ZOOM_SCALE' :
      return {scale: action.data};
    default :
      return state
  }
};
export const change_scale = (scale) => {
  return {
    type: CHANGE_ZOOM_SCALE,
    data: scale
  }
};