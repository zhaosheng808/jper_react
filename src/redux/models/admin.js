/**
 * Created by DELL on 2017/11/16.
 */
export const LOGIN = 'LOGIN';

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