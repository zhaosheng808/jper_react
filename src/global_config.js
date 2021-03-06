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
  point_in: keys['COMMA'],      // 进点
  point_out: keys['DOT'],      // 出点
  cut: keys['X'],      // 裁剪成两段
  cut_left: keys['BracketLeft'],      // 裁剪左侧
  cut_right: keys['BracketRight'],      // 裁剪右侧
  save: [keys['CTRL'], keys['S']],      // 保存
  exportProject: [keys['CTRL'], keys['P']],      // 导出
  large: [keys['CTRL'], keys['EQUALS']],      // 放大
  small: [keys['CTRL'], keys['MINUS']],      // 缩小
  ctrl: keys['CTRL'],
};