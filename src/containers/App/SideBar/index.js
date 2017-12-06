import React, {Component} from 'react';
import { Menu } from 'element-react';
import {Link} from 'react-router-dom';

// const SubMenu = Menu.SubMenu;

export default
class SideBar extends Component {
  handleClick = (e) => {
    console.log('click ', e);
  }
  onOpen() {

  }

  onClose() {

  }
  render() {
    const sideBar = {
      width: '240px',
      float: 'left'
    }
    return (
      <div className="sideBar" style={sideBar}>
        {/*<Menu*/}
          {/*onClick={this.handleClick}*/}
          {/*style={{ width: 240 }}*/}
          {/*defaultSelectedKeys={['1']}*/}
          {/*defaultOpenKeys={['sub1']}*/}
          {/*mode="inline"*/}
        {/*>*/}
          {/*<SubMenu key="sub1" title={<span><Icon type="setting" /><span>菜单</span></span>}>*/}
            {/*<Menu.Item key="1"><Link to='/'>工作台</Link></Menu.Item>*/}
            {/*<Menu.Item key="2"><Link to='/home'>home</Link></Menu.Item>*/}
            {/*<Menu.Item key="3"><Link to='/404'>404</Link></Menu.Item>*/}
            {/*<Menu.Item key="4"><Link to='/login'>登录</Link></Menu.Item>*/}
          {/*</SubMenu>*/}
        {/*</Menu>*/}
        <Menu defaultActive="1" className="el-menu-vertical-demo" onOpen={this.onOpen.bind(this)} onClose={this.onClose.bind(this)}>
          <Menu.SubMenu index="1" title={<span><i className="el-icon-message"></i>导航一</span>}>
            <Link to='/'><Menu.Item index="1-1">工作台</Menu.Item></Link>
            <Link to='/home'><Menu.Item index="1-2">home</Menu.Item></Link>
            <Link to='/404'><Menu.Item index="1-3">404</Menu.Item></Link>
            <Link to='/login'><Menu.Item index="1-4">登录</Menu.Item></Link>
          </Menu.SubMenu>
        </Menu>
      </div>
    );
  }
}