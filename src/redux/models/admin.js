/**
 * Created by DELL on 2017/11/16.
 */
const LOGIN = 'LOGIN';

const defaultState = {
  from: '',
  head_image: '',
  login_source: '',
  nickname: '',
  token: '',
  uuid: ''
};

export default function reduce (state = defaultState, action = {}) {
  switch (action.type) {
    case 'LOGIN' :
      return {...action.data};
    default :
      return state
  }
}

export const login = (userInfo) => {
  return {
    type: LOGIN,
    data: userInfo
  }
};