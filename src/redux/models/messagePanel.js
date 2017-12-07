/**
 * Created by DELL on 2017/12/7.
 */
// 信息面板展示信息
export const LOGIN = 'LOGIN';

const defaultState = {
  type: 'audio',
  data: {}
};
export default function reduce (state = {}, action = {}) {
  switch (action.type) {
    case 'LOGIN' :
      return {username: '王小二'};
    default :
      return state
  }
}
export const login = () => {
  return {
    type: LOGIN
  }
};