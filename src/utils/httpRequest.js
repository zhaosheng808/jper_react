/**
 * Created by DELL on 2017/12/27.
 */
import $ from 'jquery';

/*
 * obj -> ajax 参数配置
 * MD5 是否md5加密
 *
 *
 * */
export const httpRequest = (obj, md5) => {

  if (md5) {
    return $.ajax({
      url: obj.url,
      method: obj.method || 'POST',
      data: {...obj.data}
    })
  } else {
    return $.ajax({
      url: obj.url,
      method: obj.method || 'POST',
      data: {...obj.data}
    })
  }
};