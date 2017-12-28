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
  },
  //秒转化成 时分秒 00: 00: 00
  secondToDate: (seconds) => {
    let h = Math.floor(seconds / 3600).toString();
    let m = Math.floor((seconds / 60 % 60)).toString();
    let s = Math.floor((seconds % 60)).toString();
    if (h.length < 2) {
      h = '0' + h;
    };
    if (m.length < 2) {
      m = '0' + m;
    };
    if (s.length < 2) {
      s = '0' + s;
    };
    return h + ':' + m + ':' + s;
  }
}