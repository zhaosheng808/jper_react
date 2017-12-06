import React, {Component} from 'react';
import { Dropdown } from 'element-react';
import logo from '@/assets/images/Fruit-1.png';
import './index.css';

export default
class NavBar extends Component {
  _quit = () => {
    console.log('退出');
  };
  render() {
    return (
      <div className="nav_bar">
        <div className="appIcon image_box">
          <img src={logo} alt="logo" />
        </div>
        <h3 className="app_name">聚焦企业版</h3>
        <div className="user_box">
          <Dropdown menu={(
            <Dropdown.Menu>
              <Dropdown.Item>个人中心</Dropdown.Item>
              <Dropdown.Item disabled>修改密码</Dropdown.Item>
              <Dropdown.Item divided><div onClick={this._quit}>退出</div></Dropdown.Item>
            </Dropdown.Menu>
          )}
          >
      <div className="el-dropdown-link">
        <div className="user_avatar image_box">
          <img src={logo} alt="logo" />
        </div>
        用户昵称<i className="el-icon-caret-bottom el-icon--right"></i>
      </div>
          </Dropdown>
        </div>
      </div>
    );
  }
}
