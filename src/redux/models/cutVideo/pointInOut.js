/**
 * Created by DELL on 2017/12/19.
 */
/*
 * 进出点 : 对应在时间轴的时间
 * */
export const CHANGE_IN_POINT = 'CHANGE_IN_POINT';
export const CHANGE_OUT_POINT = 'CHANGE_OUT_POINT';

const defaultState = {
  // inPoint: {isShow: false, time: 0},
  // outPoint: {isShow: false, time: 0},
  inPoint: {isShow: true, time: 0},
  outPoint: {isShow: true, time: 100}
};

export default function reduce (state = defaultState, action = {}) {
  switch (action.type) {
    case 'CHANGE_IN_POINT' :
      return {...state, inPoint: {isShow: true, time: action.data}};
    case 'CHANGE_OUT_POINT' :
      return {...state, outPoint: {isShow: true, time: action.data}};
    default :
      return state
  }
}

export const change_inPoint = (data) => {
  return {
    type: CHANGE_IN_POINT,
    data
  }
};
export const change_outPoint = (data) => {
  return {
    type: CHANGE_OUT_POINT,
    data
  }
};