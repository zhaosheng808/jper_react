/**
 * Created by DELL on 2017/12/23.
 */
/*
 * 覆盖检测 是否开启全局检测压条覆盖还是重叠
 * -1: 不开启 1:开启
 * 默认为1 即不能覆盖，有覆盖向后位移
 * */
export const CHANGE_COVER = 'CHANGE_COVER';

const defaultState = {
  cover: 0
};

export default function reduce (state = defaultState, action = {}) {
  switch (action.type) {
    case 'CHANGE_COVER' :
      return {cover: action.data || 1};
    default :
      return state
  }
}

export const change_cover = (data) => {
  return {
    type: CHANGE_COVER,
    data
  }
};