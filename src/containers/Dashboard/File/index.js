/**
 * Created by DELL on 2017/12/5.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import './index.css';
import ListCard from './ListCard';
import dragImg from '@/assets/other/example.png';
import api from '@/api';
import $ from 'jquery';
import md5 from 'md5';

class File extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [
        {
          type: 'video',
          material_uuid: '',
          name: '很长很长的名字12345678999',
          src: 'http://toutiao-cdn-jper.foundao.com/ovesystem/data/material/2017/09/07/ymzcut_11709540701101010818201_04bf9d04b5ff80ab2656093b6e4f2617.mp4',
          cover: dragImg,
          origin_time: 8,
          width: '',
          height: ''
        },
        {
          type: 'video',
          name: 'm3u8',
          material_uuid: '',
          src: 'http://toutiao-cdn-jper.foundao.com/ovesystem/data/material/2017/11/03/ymzcut_117111303101710108182023_e8875e7ab2e1668794363a5f2fc78dec.mp4',
          cover: dragImg,
          origin_time: 91,
          width: '',
          height: ''
        },
      ]
    };
  }

  makeSign = (obj) => {
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
  };

  componentWillMount() {
    const {admin} = this.props;
    const time = Date.parse(new Date()) / 1000;
    if (admin.live_id) { // 央视裁剪过来的
      $.ajax({
        url: api.importLiveMaterial,
        method: 'POST',
        dataType: 'json',
        data: {
          token: admin.token,
          live_id: admin.live_id
        }
      }).done(resp => {
        if (resp.code === 0) {
          $.ajax({
            url: api.materialInfo,
            method: 'POST',
            dataType: 'json',
            data: {
              uuid: admin.uuid,
              token: admin.token,
              material_uuid: resp.data.material_uuid,
              time: time,
              sign: this.makeSign({
                uuid: admin.uuid,
                token: admin.token,
                time: time,
                material_uuid: resp.data.material_uuid,
              })
            }
          }).done((res) => {
            if (res.code === 0) {
              const {list} = this.state;
              const {data = {}} = res;
              console.log(data);
              list.push({
                type: 'video',
                name: data.name,
                src: data.src,
                cover: data.head_img,
                origin_time: data.info.seconds,
                material_uuid: data.material_uuid,
                width: data.info.width,
                height: data.info.height
              });
              this.setState({
                list
              })
            }else {
              console.log('素材获取失败-.- id: ', resp.data.material_uuid)
            }
          })
        } else {
          alert(resp.msg);
        }
      })
    }
  };

  upload_click = () => {
    this.refs.upload_source_input.click();
  };

  render() {
    const {list = []} = this.state;
    return (
      <div className="file_panel">
        <div className="panel_header">
          <div className="menu_item menu_media">
            <div className="menu_icon"/>
            <span>媒资库</span></div>
          <div className="menu_item menu_text">
            <div className="menu_icon"/>
            <span>字幕压条</span></div>
          <div className="menu_item menu_effect">
            <div className="menu_icon"/>
            <span>视频特效</span></div>
        </div>
        <div className="panel_body">
          <div className="file_choose_panel">
            文件选择区域
          </div>
          <div className="file_list">
            <div className="file_list_title">
              <div className="list_arrangement">
                <div className="show_list menu_icon" title="列表"/>
                <div className="show_tile menu_icon" title="平铺"/>
              </div>
              <div className="list_origin">
                <span>全部</span>
                <span>云端</span>
                <span>本地</span>
              </div>
            </div>
            <div className="file_list_content">
              <div className="source_card">
                <div className="source_card_body add_source" onClick={this.upload_click}/>
                <div className="source_card_footer">添加</div>
              </div>
              {list.map((item, index) => {
                return (
                  <ListCard item={item} key={index}/>
                )
              })}
            </div>
          </div>
        </div>
        <input type="file" ref='upload_source_input' id="upload_source_input"/>

        {/*<div className="list" onDragStart={this._dragStart.bind(this, 'video')} onDragEnd={this._dragEnd} draggable="true">video</div>*/}
        {/*<div className="list" onDragStart={this._dragStart.bind(this, 'text')} onDragEnd={this._dragEnd} draggable="true">text</div>*/}
        {/*<div className="list" onDragStart={this._dragStart.bind(this, 'audio')} onDragEnd={this._dragEnd} draggable="true">audio</div>*/}
      </div>
    );
  }
}
export default  connect(state => ({
  videoTrackList: state.videoTrackList.data,
  admin: state.admin
}), {})(File);