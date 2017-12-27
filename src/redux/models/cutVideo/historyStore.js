/**
 * Created by DELL on 2017/12/27.
 */
/*
* 历史记录
* 储存关键步骤
* */
import tools from '@/utils/tools';

export const ADD_HISTORY = 'ADD_HISTORY';
export const DEL_HISTORY = 'DEL_HISTORY';

const defaultState = {
  history: []
};

export default function reduce (state = defaultState, action = {}) {
  const newState = tools.deepClone(state);
  switch (action.type) {
    case 'ADD_HISTORY' :
      if (newState.history.length > 10) {
        // 删除数组最后一个
        newState.history.pop();
      }
      // 向数组第一个添加新的记录
      newState.history.splice(0,0,action.data);
      return newState;
    case 'DEL_HISTORY' :
      if (newState.history.length > 0) {
        // 删除数组第一个
        newState.history.shift();
      }
      return newState;
    default :
      return state
  }
}

export const add_history = (data) => {
  return {
    type: ADD_HISTORY,
    data
  }
};
export const del_history = (data) => {
  return {
    type: DEL_HISTORY,
    data
  }
};