/**
 * Created by DELL on 2017/11/14.
 */
// Action 创建函数 就是生成 action 的方法。
// Redux 中只需把 action 创建函数的结果传给 dispatch() 方法即可发起一次 dispatch 过程。
// store 里能直接通过 store.dispatch() 调用 dispatch() 方法，
// 但是多数情况下你会使用 react-redux 提供的 connect() 帮助器来调用。
// bindActionCreators() 可以自动把多个 action 创建函数 绑定到 dispatch() 方法上。
export const ADD = 'ADD';
export const LOGIN = 'LOGIN';
export const add = () => {
  return {
    type: ADD
  }
};
export const login = () => {
  return {
    type: LOGIN
  }
};