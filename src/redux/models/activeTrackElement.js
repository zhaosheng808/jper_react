/**
 * Created by DELL on 2017/12/7.
 */
/*
* 激活的轨道元素类型，
* 用于操作信息展示
*
* */
export const CHANGE_ACTIVE_TRACK_ELEMENT = 'CHANGE_ACTIVE_TRACK_ELEMENT';

const defaultState = {
  type: '',
  trackIndex: 0,
  itemIndex: 0,
};

export default function reduce (state = defaultState, action = {}) {
  switch (action.type) {
    case 'CHANGE_ACTIVE_TRACK_ELEMENT' :
      return action.data;
    default :
      return state
  }
}

export const active_element_change = (data) => {
  return {
    type: CHANGE_ACTIVE_TRACK_ELEMENT,
    data
  }
};