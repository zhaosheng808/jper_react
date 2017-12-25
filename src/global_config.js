/**
 * Created by DELL on 2017/12/18.
 */
/*
* 全局配置变量
* */

import keys from '@/utils/keys';
export default {
};
// 快捷键
export const shortcut_key =  {     // 快捷键
  play: keys['SPACE'],             // 播放、暂停
  last_frame: keys['LEFT'],       // 上一帧
  next_frame: keys['RIGHT'],      // 下一帧
  cut_left: [keys['CTRL'], keys['BracketLeft']],      // 裁剪左侧
  cut_right: [keys['CTRL'], keys['BracketRight']],      // 裁剪右侧
  save: [keys['CTRL'], keys['S']],      // 裁剪右侧
  ctrl: keys['CTRL'],
};