/**
 * Created by DELL on 2017/11/17.
 */
export const ADD = 'ADD';

export default function reduce (state = {number: 0}, action = {}) {
  switch (action.type) {
    case 'ADD' :
      return {number: state.number + 1};
    default :
      return state
  }
}
export const add = () => {
  return {
    type: ADD
  }
};