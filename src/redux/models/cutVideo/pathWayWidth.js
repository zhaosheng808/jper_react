/**
 * Created by DELL on 2017/12/21.
 */
/*
* 轨道长度 : 动态更改轨道的长度
* */
export const CHANGE_Width = 'CHANGE_Width';

const defaultState = {
  width: 1300
};

export default function reduce (state = defaultState, action = {}) {
  switch (action.type) {
    case 'CHANGE_Width' :
      return {...state, width: action.data};
    default :
      return state
  }
}

export const change_width = (data) => {
  return {
    type: CHANGE_Width,
    data
  }
};