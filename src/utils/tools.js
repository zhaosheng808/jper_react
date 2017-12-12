/**
 * Created by DELL on 2017/12/7.
 */

export default {
  addEventHandler: (target, type, fn) => {
    if (target.addEventListener) {
      target.addEventListener(type, fn);
    }else{
      target.attachEvent('on' + type, fn);
    }
  },
  removeEventHandler: (target, type, fn) => {
    if(target.removeEventListener){
      target.removeEventListener(type, fn);
    }else{
      target.detachEvent('on' + type, fn);
    }
  },
  deepClone: (obj) => {     // 对象中没有function
    return JSON.parse(JSON.stringify(obj));
  }
}