/**
 * Created by DELL on 2017/12/8.
 */
export const CHANGE_NEEDLE_STATE = 'CHANGE_NEEDLE_STATE';

const defaultState = {
  currentTime: 0,
};

export default function reduce (state = defaultState, action = {}) {
  switch (action.type) {
    case 'CHANGE_NEEDLE_STATE' :
      return {currentTime: action.data};
    default :
      return state
  }
}

export const change_needleState = (data) => {
  return {
    type: CHANGE_NEEDLE_STATE,
    data
  }
};