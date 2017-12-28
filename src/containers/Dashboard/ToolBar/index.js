/**
 * Created by DELL on 2017/12/11.
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import tools from '@/utils/tools';
import {Slider} from 'element-react';
import {change_inPoint, change_outPoint} from '@/redux/models/cutVideo/pointInOut';
import {change_cover} from '@/redux/models/cutVideo/checkCover';
import {videoTrack_edit, videoTrackList_add} from '@/redux/models/videoTrackList';
import {change_scale} from '@/redux/models/zoomScale';
import {shortcut_key} from '@/global_config';

import api from '@/api';
import $ from 'jquery';

import './toolbar.css';

class ToolBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zoom_min: 1,
      zoom_max: 30,
      isUtilsKeyDown: false,   // 组合按键 是否按下
      default_zoom_scale: 10
    };
  }

  componentDidMount() {
    const {zoom_scale} = this.props;
    this.setState({
      default_zoom_scale: zoom_scale
    });
    tools.addEventHandler(window, 'keydown', this._keydown);
    tools.addEventHandler(window, 'keyup', this._keyup);
  };

  componentWillUnmount() {
    tools.removeEventHandler(window, 'keydown', this._keydown);
    tools.removeEventHandler(window, 'keyup', this._keyup);
  };

  componentWillReceiveProps(nextProps) {
  };

  _fullScreen = () => {
    document.querySelector('html').webkitRequestFullScreen();
  };
  popNotice = () => {
    if (Notification.permission === "granted") {
      const notification = new Notification("Hi，帅哥：", {
        body: '可以加你为好友吗？',
        icon: 'http://image.zhangxinxu.com/image/study/s/s128/mm1.jpg'
      });
      notification.onclick = function () {
        alert('张小姐已于' + new Date().toTimeString().split(' ')[0] + '加你为好友！');
        notification.close();
      };
    }
  };
  _handel_notice = () => {
    const _this = this;
    console.log(Notification.permission, 'Notification.permission');
    if (Notification.permission === "granted") {
      this.popNotice();
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission(function (permission) {
        _this.popNotice();
      });
    }
  };
  _setPointIn = () => {
    const {needleLeft, pointInOut, zoom_scale} = this.props;
    const pointOut_time = pointInOut.outPoint.time;
    const pointIn_time = needleLeft / zoom_scale;
    const pointIn_isShow = pointInOut.outPoint.isShow;
    if (pointIn_time <= pointOut_time || !pointIn_isShow) {
      this.props.change_inPoint(pointIn_time);
    } else {
      alert('出点必须在进点之后哦');
    }

  };
  _setPointOut = () => {
    const {needleLeft, pointInOut, zoom_scale} = this.props;
    const pointIn_time = pointInOut.inPoint.time;
    const pointOut_time = needleLeft / zoom_scale;
    if (pointIn_time <= pointOut_time) {
      this.props.change_outPoint(pointOut_time);
    } else {
      alert('出点必须在进点之后哦');
    }
  };
  // 裁剪掉视频左侧 指针位置划分视频左右
  _cutLeft = () => {
    const {needleLeft, current_playing_video, zoom_scale, videoTrackList} = this.props;
    const {trackIndex, itemIndex} = current_playing_video;
    let playIngVideo = {};
    if (videoTrackList[current_playing_video.trackIndex]) {
      playIngVideo = videoTrackList[current_playing_video.trackIndex].child[current_playing_video.itemIndex];
    }
    const needleTime = needleLeft / zoom_scale;
    if (playIngVideo.playerId) {
      const cut_time = needleTime - playIngVideo.start_time;  // 本次左侧裁剪掉的时间
      const relative_start = playIngVideo.relative_start + cut_time;
      const time = playIngVideo.time - cut_time;
      this.props.videoTrack_edit(trackIndex, itemIndex, {
        ...playIngVideo,
        time,
        relative_start,
        start_time: needleTime
      });
    } else {
      alert('当前没有视频可以裁剪');
    }

  };
  _cutRight_handel = () => {
    this._cutRight();
  };
  // 裁剪掉视频右侧
  _cutRight = (split) => {
    /*
     * split 是否将右侧裁剪掉的添加到新的素材中，true :即原视频被裁剪成两段
     * */
    const {needleLeft, current_playing_video, zoom_scale, videoTrackList} = this.props;
    const {trackIndex, itemIndex} = current_playing_video;
    let playIngVideo = {};
    if (videoTrackList[current_playing_video.trackIndex]) {
      playIngVideo = videoTrackList[current_playing_video.trackIndex].child[current_playing_video.itemIndex];
    }
    const needleTime = needleLeft / zoom_scale;
    if (playIngVideo.playerId) {
      const cut_time = playIngVideo.start_time + playIngVideo.time - needleTime;  // 本次右侧裁剪掉的时间
      const time = playIngVideo.time - cut_time;
      this.props.videoTrack_edit(trackIndex, itemIndex, {...playIngVideo, time});
      if (split) {
        // 将裁掉的部分新增到轨道中
        const timestamp = Date.parse(new Date());
        const id = timestamp;                                   // id               id为当前时间戳
        const playerId = 'playerId' + timestamp;                             // video播放器       播放器id格式 -- playerId + 时间戳
        const add_time = playIngVideo.time - time;
        const add_relative_start = playIngVideo.relative_start + time;
        this.props.videoTrackList_add({
          ...playIngVideo,
          id,
          playerId,
          time: add_time,
          start_time: needleTime,
          relative_start: add_relative_start
        }, trackIndex);
      }
    } else {
      alert('当前没有视频可以裁剪');
    }
  };
  //_cut 裁成两段
  _cut = () => {
    this._cutRight(true);
  };
  // 比例尺缩小
  _scaleSmall = () => {
    document.querySelector('.zoom_line_box .el-input-number__decrease').click();
  };
  // 比列尺放大
  _scaleLarge = () => {
    document.querySelector('.zoom_line_box .el-input-number__increase').click();
  };
  _change_zoom = (newScale) => {
    const {zoom_scale} = this.props;
    if (newScale !== zoom_scale) {
      this.props.change_scale(newScale);
    }
  };
  // 向右吸附
  _magnetRight = () => {
    const {activeElement, videoTrackList} = this.props;
    if (activeElement.type === 'video') {
      const {trackIndex, itemIndex} = activeElement;
      const activeTrack = videoTrackList[trackIndex].child;
      const activeItem = videoTrackList[trackIndex].child[itemIndex];

      const activeItem_endTime = activeItem.start_time + activeItem.time;

      let min_start_time = 0;
      for (let i = 0; i < activeTrack.length; i++) {
        if (activeItem.id !== activeTrack.id) {    // 排除自己

          // 如果有起始时间大于选中元素的结束时间 并且最小时间大于该循环的起始时间 则最小起始时间为现在循环的起始时间
          if (activeTrack[i].start_time >= activeItem_endTime) {
            if (!min_start_time) {
              min_start_time = activeTrack[i].start_time;
            } else if (min_start_time > activeTrack[i].start_time) {
              min_start_time = activeTrack[i].start_time;
            }
          }
        }
      }
      if (min_start_time !== 0) { //
        const newStartTime = min_start_time - activeItem.time;
        this.props.videoTrack_edit(trackIndex, itemIndex, {...activeItem, start_time: newStartTime});
      }
    } else {
      alert('当前没有选中的video');
    }
  };
  // 向左吸附
  _magnetLeft = () => {
    const {activeElement, videoTrackList} = this.props;
    if (activeElement.type === 'video') {
      const {trackIndex, itemIndex} = activeElement;
      const activeTrack = videoTrackList[trackIndex].child;
      const activeItem = videoTrackList[trackIndex].child[itemIndex];


      let max_start_time = 0;
      for (let i = 0; i < activeTrack.length; i++) {
        if (activeItem.id !== activeTrack.id) {    // 排除自己

          // 如果有结束时间小于选中元素的起始时间 并且最大合适起始时间大于该循环的结束时间 则最大合适起始时间为现在循环的结束时间
          if (activeTrack[i].start_time + activeTrack[i].time <= activeItem.start_time) {
            if (max_start_time === 0) {  // 初始为 0 需要单独判断，如果没有就默认为他
              max_start_time = activeTrack[i].start_time + activeTrack[i].time;
            } else if (max_start_time < activeTrack[i].start_time + activeTrack[i].time) {
              max_start_time = activeTrack[i].start_time + activeTrack[i].time
            }
          }
        }
      }

      if (max_start_time !== 0) { //
        this.props.videoTrack_edit(trackIndex, itemIndex, {...activeItem, start_time: max_start_time});
      }
    } else {
      alert('当前没有选中的video');
    }
  };
  // 覆盖挤压
  _changeCover = () => {
    /*-1: 不开启 1:开启 默认开启覆盖检测，即不能覆盖*/
    const {checkCover} = this.props;
    this.props.change_cover(-checkCover);
  };
  // 保存
  _save = () => {
    const {state} = this.props;
    const videoTrackList_data = state.videoTrackList.data;
    console.log(state, 'state');
    console.log(videoTrackList_data, 'videoTrackList_data');
  };
  // 导出
  _export = () => {

    const {state} = this.props;
    const {videoTrackList, pointInOut} = state;
    const videoTrackList_data = videoTrackList.data;
    const videoTrackList_data_clone = tools.deepClone(videoTrackList_data);

    if (pointInOut.inPoint.isShow && pointInOut.outPoint.isShow) {
      const inPoint_time = pointInOut.inPoint.time;
      const outPoint_time = pointInOut.outPoint.time;

      // 1.初步过滤  将时间线里面的video取出 ，裁掉时间线左右两侧 放入一个数组中
      const exportVideo_inTime = screenIntime(inPoint_time, outPoint_time, videoTrackList_data_clone);               // 时间线内的video

      if (exportVideo_inTime.length < 1) {
        alert('导出区间没有视频');
        return
      }
      // 2.去重  将时间线里面的video重叠部分去掉

      const exportVideo_noRepeat = delete_repeat(exportVideo_inTime);

      // 3.排序 按照视频的起始时间进行排序

      exportVideo_noRepeat.sort(tools.sortBy('start_time'));


      // 4. 间隙导成 空的video

      const exportVideo_addBlank = add_blank(inPoint_time, outPoint_time, exportVideo_noRepeat);

      // 5. 转化成后台接受的格式

      const finalVideo = exportApiStyle(inPoint_time, exportVideo_addBlank);

      // 6. 导出最终数据到后台

      this._exportToServer(finalVideo);

    } else {
      alert('导出前必须设置进点和出点哦');
      // console.log('没有进点和出点');
    }

    // 初步筛选在时间线里面的
    function screenIntime(inPoint_time, outPoint_time, videoTrackList_data_clone) {
      const exportVideo = [];
      videoTrackList_data_clone.forEach((item, index) => {
        if (item.child) {
          // 每条轨道后面的优先级比前面的高  -- 最后操作的层次比前面的高
          for (let i = item.child.length - 1; i >= 0; i--) {

            const childItem = item.child[i];
            const childItem_endTime = childItem.start_time + childItem.time;
            // 结束时间大于进点&&起始时间小于出点 如果item在导出区间  可以导出
            if (childItem.start_time + childItem.time > inPoint_time && childItem.start_time < outPoint_time) {
              // 两端都被被裁剪掉  起始时间小于进点 && 结束时间时间大于出点
              if (childItem.start_time < inPoint_time && childItem.start_time + childItem.time > outPoint_time) {
                console.log('两端都被裁剪掉');
                /*
                 * 两端都被裁剪掉
                 * 需要修改原数据的开始时间 、 相对于原视频的起始时间 、 时间长度
                 * */
                const cut_time_left = inPoint_time - childItem.start_time;  // 左侧裁剪掉的时间
                // const cut_time_right = childItem_endTime - outPoint_time;  // 右侧裁剪掉的时间

                const new_start_time = inPoint_time;

                const new_time = outPoint_time - inPoint_time;
                const new_relative_start = childItem.relative_start + cut_time_left;

                childItem.time = new_time;
                childItem.start_time = new_start_time;
                childItem.relative_start = new_relative_start;

              } else if (childItem.start_time < inPoint_time) {                    // 前面被裁减掉
                console.log('// 前面被裁减掉');

                /*
                * 前面被裁减掉
                * 需要修改原数据的开始时间 、 相对于原视频的起始时间 、 时间长度
                * */
                const cut_time = inPoint_time - childItem.start_time;

                const new_start_time = inPoint_time;
                const new_time = childItem_endTime - inPoint_time;
                const new_relative_start = childItem.relative_start + cut_time;

                childItem.time = new_time;
                childItem.start_time = new_start_time;
                childItem.relative_start = new_relative_start;

              } else if (childItem.start_time + childItem.time > outPoint_time) { // 后面被裁减掉
                console.log('// 后面被裁减掉');

                /*
                 * 后面被裁减掉
                 * 需要修改原数据的时间长度
                 * */
                const cut_time = childItem_endTime - outPoint_time;   // 裁剪掉的时间 == 视频总时间 - 出点的时间
                const new_time = childItem.time - cut_time;
                childItem.time = new_time;

              } else {                                                            // 没有被裁减
                console.log('// 没有被裁减');

              }
              exportVideo.push(childItem);
            }
          }
        }
      });
      console.log(exportVideo, 'exportVideo');
      return exportVideo;
    };
    // 去重 -> 删除掉遮挡的部分 前面的轨道优先级大于后面的，轨道内部前面的优先级小于后面的
    function delete_repeat(exportVideo) {
      for (let i = 0; i < exportVideo.length; i++) {
        const item = exportVideo[i];
        const item_endTime = item.start_time + item.time;
        for (let j = i + 1; j < exportVideo.length; j++) { // 前面的部分优先级较高，不会遮挡前面的  自动过滤掉前面的
          const secondItem = exportVideo[j];
          const secondItem_endTime = secondItem.start_time + secondItem.time;

          if (item.start_time > secondItem.start_time && item_endTime < secondItem_endTime) {
            // 遮挡中间
            console.log('// 遮挡中间');

            /*
             * 遮挡中间
             * 视频被分隔成两端
             *
             * 先将将原视频转化成第一段视频，再向数据轨道中添加新的视频  不是redux中的轨道，是传给后台的轨道
             *
             * */

            const firstVideo_time = item.start_time - secondItem.start_time;  // 时长等于覆盖元素的起始时间 - 被覆盖元素的起始时间

            /*
             * 后段视频
             * 需修改视频的 起始时间、时长、相对于原视频的起始时间
             * */

            const secondVideo = tools.deepClone(secondItem);

            secondVideo.start_time = item_endTime;                                                       // 起始时间等于覆盖视频的结束时间
            secondVideo.relative_start = secondItem.relative_start + firstVideo_time + item.time;        // 相对时间等于原相对时间 + 第一段视频时间 + 覆盖视频的时间
            secondVideo.time = secondItem_endTime - item_endTime;                                        // 时间等于总时间 - 覆盖视频的总时间

            exportVideo.splice(j + 1, 0, secondVideo);
            /*
             * 前段视频
             * 只需修改视频的时间长度
             * 放在后端视频后面 防止影响前面的数据
             * */

            exportVideo[j].time = firstVideo_time;
            // j = j - 1;

            // console.log(exportVideo, 'exportVideo_裁剪成两短');
            // return false


          } else if (item.start_time <= secondItem.start_time && item_endTime >= secondItem_endTime) {
            /*
             * 全部遮挡
             * 直接删除
             * */
            console.log('// 全部遮挡');


            exportVideo.splice(j, 1);

          } else if (item_endTime > secondItem.start_time && item_endTime < secondItem_endTime) {

            /*
             * 遮挡左侧
             * 修改被遮挡的起始时间、相对原始视频的起始时间、时长
             * */
            console.log('// 遮挡左侧');

            const cut_time = item_endTime - secondItem.start_time;   // 左侧覆盖部分 = 覆盖video的结束时间 - 被覆盖video的起始时间

            const new_start_time = item_endTime;                               // 起始时间 = 覆盖物的结束时间
            const new_relative_start = secondItem.relative_start + cut_time;   // 相对原始频的起始时间 = 原相对时间 + 覆盖时间
            const new_time = secondItem.time - cut_time;                       // 视频时间 = 原相时间 - 覆盖时间

            secondItem.start_time = new_start_time;
            secondItem.relative_start = new_relative_start;
            secondItem.time = new_time;


          } else if (item.start_time > secondItem.start_time && item.start_time < secondItem_endTime) {
            /*
             * 遮挡右侧
             * 修改被遮挡的时长
             * */
            console.log('// 遮挡右侧');

            const cut_time = secondItem_endTime - item.start_time;   // 左侧覆盖部分 = 覆盖video的结束时间 - 被覆盖video的起始时间
            const new_time = secondItem.time - cut_time;                       // 视频时间 = 原相时间 - 覆盖时间
            secondItem.time = new_time;

          } else {
            console.log('// 没有遮挡')
          }
        }
      }
      return exportVideo
    }

    // 间隙添加blank
    function add_blank(inPoint_time, outPoint_time, origin_arr) {
      for (let i = 0; i < origin_arr.length; i++) {
        const item = origin_arr[i];
        const end_time = item.start_time + item.time;
        if (i === 0) { // 第一个元素需要判断前面是否空白
          if (item.start_time > inPoint_time) {
            const blank_item = {
              type: 'blank',
              start_time: inPoint_time,
              time: item.start_time - inPoint_time
            };
            origin_arr.splice(i, 0, blank_item);
          }
        }else {                              // 其他 判断上一个的结束时间是否 = 起始时间，否则添加black
          const lastItem = origin_arr[i - 1];
          const lastItem_endTime = lastItem.start_time + lastItem.time;
          if (lastItem_endTime < item.start_time) {
            const blank_item = {
              type: 'blank',
              start_time: lastItem_endTime,
              time: item.start_time - lastItem_endTime
            };
            origin_arr.splice(i, 0 , blank_item);
            i = i - 1;
          }
          if (i === origin_arr.length - 1) { // 最后一个元素需要判断后面是否空白
            if (end_time < outPoint_time) {
              const blank_item = {
                type: 'blank',
                start_time: end_time,
                time: outPoint_time - end_time
              };
              origin_arr.push(blank_item);
            }
          }
        }
      }
      return origin_arr
    }

    // 格式过滤
    function exportApiStyle(inPoint_time, origin_arr) {
      const finalResult = [];
      origin_arr.forEach((item, index) => {
        if (item.type === 'video') {
          finalResult.push({
            type: 'video',                                                               //
            material_uuid: item.material_uuid || 'blank',
            ori_start_time: item.relative_start,                                         //截取开始时间   相对于原视频
            ori_end_time: item.relative_start + item.time,                               //截取结束时间   相对于原视频
            new_start_time: item.start_time - inPoint_time                               //当前视频在新视频中的开始时间  仅用于排序
          })
        } else if (item.type === 'blank') {
          finalResult.push({
            type: 'blank',                                                               //
            material_uuid: '',
            ori_start_time: 0,                                                           //截取开始时间   相对于原视频
            ori_end_time: item.time,                                                     //截取结束时间   相对于原视频
            new_start_time: item.start_time - inPoint_time                               //当前视频在新视频中的开始时间  仅用于排序
          });
        }
      });
      return finalResult;
    }
  };


  // 导出数据到服务器
  _exportToServer = (finalVideo) => {
    console.log(finalVideo, 'finalVideo');
    const time = Date.parse(new Date()) / 1000;
    const {admin} = this.props;
    $.ajax({
      url: api.exportLiveCut,
      method: 'POST',
      dataType: 'json',
      data: {
        token: admin.token,
        type: 'none',
        videos: finalVideo,
        time: time,
        sign: tools.makeSign({
          token: admin.token,
          type: 'none',
          videos: finalVideo,
          time: time,
        })
      }
    }).done(resp => {
      if (resp.code === 0) {

      }else {
        console.log('导出失败： ', resp.msg);
        alert('导出失败： ', resp.msg);
      }
    })
  };
  // 快捷键
  _keydown = (event) => {
    const {cut_left, cut_right, ctrl, save, cut} = shortcut_key;
    const e = event || window.event || window.arguments.callee.caller.arguments[0];
    if (e && e.keyCode) {
      switch (e.keyCode) {
        case cut_left[1]:
          event.preventDefault();
          this.cutVideo(-1);
          break;
        case cut_right[1]:
          event.preventDefault();
          this.cutVideo(1);
          break;
        case save[1]:
          event.preventDefault();
          this.quick_save();
          break;
        case cut[1]:
          event.preventDefault();
          this.quick_cut();
          break;
        case ctrl:
          event.preventDefault();
          this.utilsKeyDown();
          break;
        default:
          return;
      }
    }
  };
  // 快捷键
  _keyup = (event) => {
    const {ctrl} = shortcut_key;
    const e = event || window.event || window.arguments.callee.caller.arguments[0];
    if (e && e.keyCode) {
      switch (e.keyCode) {
        case ctrl:
          event.preventDefault();
          this.utilsKeyUp();
          break;
        default:
          return;
      }
    }
  };

  cutVideo(direction) {
    /*
     * direction 裁剪方向 -1 ：left 1 right
     * */
    const {isUtilsKeyDown} = this.state;
    if (isUtilsKeyDown) {  // 如果shift 按下了才会有反应
      if (direction === -1) {
        this._cutLeft();
      } else if (direction === 1) {
        this._cutRight();
      }
    }
  }

  quick_save() {
    /*
     * direction 裁剪方向 -1 ：left 1 right
     * */
    const {isUtilsKeyDown} = this.state;
    if (isUtilsKeyDown) {
      this._save();
    }
  }

  quick_cut = () => {
    const {isUtilsKeyDown} = this.state;
    if (isUtilsKeyDown) {
      this._cut();
    }
  };

  utilsKeyDown() {
    this.setState({
      isUtilsKeyDown: true
    })
  }

  utilsKeyUp() {
    this.setState({
      isUtilsKeyDown: false
    })
  }

  render() {
    const {zoom_scale, checkCover} = this.props;
    const {zoom_min, zoom_max} = this.state;

    return (
      <div className="toolbar">
        <div className="btn_zoom_group btn_group">
          <div className="icon_mini menu_icon" onClick={this._scaleSmall}/>
          <div className="zoom_line_box">
            <span className="zoomNum">{zoom_scale}</span>
            <Slider min={zoom_min}
                    max={zoom_max}
                    value={zoom_scale}
                    showTooltip={false}
                    showInput={true}
                    onChange={this._change_zoom}/>
          </div>
          <div className="icon_max menu_icon" onClick={this._scaleLarge}/>
        </div>
        <div className="btn_group btn_step_group">
          <div className="menu_icon icon_revoke large_icon"/>
          <div className="menu_icon icon_refresh large_icon"/>
        </div>
        <div className="btn_group">
          <div className="menu_icon large_icon icon_cutLeft" title="裁剪左侧" onClick={this._cutLeft}/>
          <div className="menu_icon large_icon icon_cutRight" title="裁剪右侧" onClick={this._cutRight_handel}/>
          <div className="menu_icon large_icon icon_magIn" title="向前吸附" onClick={this._magnetLeft}/>
          <div className="menu_icon large_icon icon_magOut" title="向后吸附" onClick={this._magnetRight}/>
          <div className="menu_icon large_icon icon_cut" title="裁分" onClick={this._cut}/>
          <div className={checkCover === 1 ? 'menu_icon large_icon icon_crush' : 'menu_icon large_icon icon_cover'}
               title="覆盖挤压" onClick={this._changeCover}/>
        </div>
        <div className="ben_group btn_project">
          <div className="menu_icon large_icon icon_pointIn" title="进点" onClick={this._setPointIn}/>
          <div className="menu_icon large_icon icon_pointOut" title="出点" onClick={this._setPointOut}/>
          <div className="menu_icon large_icon icon_save" title="保存" onClick={this._save}/>
          <div className="menu_icon large_icon icon_export" title="导出" onClick={this._export}/>
        </div>
        {/*<button id="btn_play" onClick={this.play_video}>播放</button>*/}
        {/*<button id="btn_paused" onClick={this.pause_video}>暂停</button>*/}
        {/*<button onClick={this._fullScreen}>全屏</button>*/}
        {/*<button id="btn_tips" onClick={this._handel_notice}>通知</button>*/}
      </div>
    );
  }
}
export default  connect(state => ({
    videoTrackList: state.videoTrackList.data,
    needleLeft: state.needle.currentTime,
    pointInOut: state.pointInOut,
    current_playing_video: state.current_playing_video,
    activeElement: state.activeElement,
    checkCover: state.checkCover.cover,
    state,
    admin: state.admin,
    zoom_scale: state.zoom_scale.scale
  }),
  {
    change_inPoint,
    change_outPoint,
    change_scale,
    videoTrack_edit,
    videoTrackList_add,
    change_cover
  }
)(ToolBar);