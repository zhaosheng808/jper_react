/**
 * Created by DELL on 2017/12/7.
 */
export const CHANGE_TYPE = 'CHANGE_TYPE';

const defaultState = '';

export default function reduce (state = defaultState, action = {}) {
  switch (action.type) {
    case 'CHANGE_TYPE' :
      return action.data.type;
    default :
      return state
  }
}
export const change_dragActive = (type) => {
  console.log('change_dragActive', type);
  return {
    type: CHANGE_TYPE,
    data: {
      type
    }
  }
};