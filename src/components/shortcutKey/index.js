import React, {Component} from 'react';
import './index.css'
import returnImg from '@/assets/images/close-1.png'
import returnImgHover from '@/assets/images/close-2.png'
import saveImg from '@/assets/images/save.png'
import cutImg from '@/assets/images/cut.png'
import behindCut from '@/assets/images/behindcut.png'
import frontCut from '@/assets/images/frontcut.png'
import exportImg from '@/assets/images/export.png'
import maxHover from '@/assets/images/max-hover.png'
import miniHover from '@/assets/images/mini-hover.png'
import enter from '@/assets/images/enter.png'
import extra from '@/assets/images/extra.png'


export default class ShortCutLayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowLayer: this.props.shortCutShow,
      imgSrc: returnImg,
      shortList: [
        {name: '进点', shortcut: ' < ', img: enter},
        {name: '出点', shortcut: ' > ', img: extra},
        {name: '视频起点', shortcut: ' [ ', img: frontCut},
        {name: '视频末点', shortcut: ' ] ', img: behindCut},
        {name: '裁剪素材', shortcut: ' X ', img: cutImg},
        {name: '保存', shortcut: 'Ctrl + S', img: saveImg},
        {name: '导出', shortcut: 'Ctrl + P', img: exportImg},
        {name: '放大', shortcut: 'Ctrl + +', img: maxHover},
        {name: '缩小', shortcut: 'Ctrl + -', img: miniHover},
        {name: '下一帧', shortcut: ' → '},
        {name: '上一帧', shortcut: ' ← '},
        // {name: '后退一步',shortcut:'Ctrl + Z'},

        {name: '播放/暂停', shortcut: '空格'},
        // {name: '复制',shortcut:'Ctrl + C'},


      ]
    }
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.shortCutShow !== this.state.isShowLayer) {
      this.state.isShowLayer = nextProps.shortCutShow;
      this.setState({isShowLayer: this.state.isShowLayer});
    }

  }

  imgMouseEnter = () => {
    this.state.imgSrc = returnImgHover;
    this.setState({imgSrc: this.state.imgSrc});
  }
  imgMouseLeave = () => {
    this.state.imgSrc = returnImg;
    this.setState({imgSrc: this.state.imgSrc});
  }
  layerHide = () => {
    this.state.isShowLayer = false;
    this.setState({isShowLayer: this.state.isShowLayer})
  }

  render() {
    return (
      <div className="wrap" style={{display: this.state.isShowLayer === true ? 'block' : 'none'}}>
        <div className="header">
          <div className="headerTitle">快捷键</div>
          <div className="layerHide"><img src={this.state.imgSrc} onMouseEnter={this.imgMouseEnter}
                                          onMouseLeave={this.imgMouseLeave} onClick={this.layerHide}/></div>
        </div>
        <div className="container">
          <div className="shortCutList">
            <ul>
              <div className="tableHead">
                <div className="tableHeadTr">
                  <div className="imgTd">图标</div>
                  <div className="nametTd">命令</div>
                  <div className="shortcutTd">快捷键</div>
                </div>
              </div>
              <ul className="tableContent tableScroll">
                {
                  this.state.shortList.map((item, key) => {
                    return (
                      <li className="tableRow" key={key}>
                        <div className="imgTd"><img src={item.img}/></div>
                        <div className="nametTd">{item.name}</div>
                        <div className="shortcutTd">{item.shortcut}</div>
                      </li>
                    )
                  })
                }
              </ul>

            </ul>
          </div>
        </div>
      </div>
    )
  }

}