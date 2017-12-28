/**
 * Created by DELL on 2017/12/7.
 */
import md5 from 'md5';

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
  },
  sortBy: function(attr, rev){
    /*
    * 数组里面的对象根据key值进行排序 attr : 比较的key值 rev 标识 升序 降序 默认升序排列
    * 使用方法 newArray.sort(sortBy('number',false))
    * //表示根据number属性降序排列; 若第二个参数不传递，默认表示升序排序
    *
    * */
    if(rev ===  undefined){
      rev = 1;
    }else{
      rev = (rev) ? 1 : -1;
    }

    return function(a,b){
      a = a[attr];
      b = b[attr];
      if(a < b){
        return rev * -1;
      }
      if(a > b){
        return rev * 1;
      }
      return 0;
    }
  },
  makeSign: function(obj) {
    //将value值都改为字符串，如果数组长度为0，则移除该属性
    // if (obj.hasOwnProperty('videos') && obj.videos.length > 0) {
    //   for (var i = 0; i < obj.videos.length; i++) {
    //     convertToStr(obj.videos[i]);
    //   }
    //   obj.videos = JSON.stringify(obj.videos);
    // }
    // if (obj.hasOwnProperty('layers') && obj.layers.length > 0) {
    //   for (var i = 0; i < obj.layers.length; i++) {
    //     convertToStr(obj.layers[i]);
    //   }
    //   obj.layers = JSON.stringify(obj.layers);
    // } else {
    //   delete obj.layers;
    // }
    // if (obj.hasOwnProperty('voices') && obj.voices.length > 0) {
    //   for (var i = 0; i < obj.voices.length; i++) {
    //     convertToStr(obj.voices[i]);
    //   }
    //   obj.voices = JSON.stringify(obj.voices);
    // } else {
    //   delete obj.voices;
    // }
    //
    // convertToStr(obj);

    //对象转化为数组
    var arr = [];
    for (var item in obj) {
      arr.push(item + '=' + obj[item]);
    }
    //按字典排序
    arr = arr.sort();
    //数组转化为字符串
    var str = arr.join('&');
    //大小写
    str = str.toLocaleUpperCase();
    // console.log('sign before md5:');
    // console.log(str);
    var first_md5 = md5(str + 'JPER_API');
    return md5(first_md5.substring(0, 30));
  }
}