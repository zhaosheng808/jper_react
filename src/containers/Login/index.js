/**
 * Created by DELL on 2017/11/10.
 */
import React, {Component} from 'react';
import {Button, Form, Input, Notification} from 'element-react';
// import style from './index.css';
import {connect} from 'react-redux';
import axios from 'axios';
import qs from 'qs';
import {login} from '@/redux/models/admin';
import api from '@/api';

require('./index.css');

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      form: {
        name: '',
        password: ''
      },
      rules: {
        name: [
          {required: true, message: '用户名不能为空', trigger: 'change'}
        ],
        password: [
          {required: true, message: '密码不能为空', trigger: 'change'}
        ],
      }
    };
  }

  componentDidMount() {
    // console.log(login)

    // 央视在线裁剪跳转过来的
    /*
     * 央视在线裁剪跳转过来的
     * 携带 code 以及 新闻id
     * code: MTUxNDI1NzE0M19kNDI5YzNjZC1hZmUxLWY2NTUtYTJhOS1iMmViODk2YWY0NjBfYjc5YzdlNGQ0YWUzNjI2ZGRlMDIzZmQzNDViMGZlZmM
     * */
    const params = this.getParams();
    console.log(params, ' <--params');
    const {live_id, code} = params;
    // 央视裁剪过来的 免登录
    if (live_id) {
      this._login_form_liveCut(live_id, code)
    }
  }

  _login_form_liveCut = (live_id, code) => {
    axios({
      method: 'post',
      url: api.login_liveCut,
      data: qs.stringify({
        code: code,
      }),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).then(resp => {
      const response = resp.data;
      if (response.code === 0) {
        const userInfo = response.data;
        // 登录成功保存到本地
        // 央视新闻用户添加添加is_liveCut： true 字段 表明 是来自央视在线裁剪
        this._login_success({...userInfo, live_id: live_id});
      } else {
        alert('登录失败' + response.msg);
      }
    })
  };

  getParams = () => {
    const url = window.location.hash;
    const theRequest = new Object();
    const start = url.indexOf("?");
    if (start !== -1) {
      const str = url.substr(start + 1);
      const strs = str.split("&");
      for (let i = 0; i < strs.length; i++) {
        theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
      }
    }
    return theRequest;
  };
  _onSubmit = () => {
    this.refs.form.validate((valid) => {
      if (valid) {
        this._login();
      } else {
        console.log('error submit!!');
        return false;
      }
    });
  };
  _login = () => {
    // 等服务器返回数据成功
    /*...
    * _login_success()
    * */
    /*暂时调用裁剪登录接口*/

    const code = 'MTUxNDI3MTMxMl9kNDI5YzNjZC1hZmUxLWY2NTUtYTJhOS1iMmViODk2YWY0NjBfZDA4ZDk3Y2U1MzViYzJiM2ZhNmI4M2MzNmRhOTU1NGI';
    const live_id = 21524;
    this._login_form_liveCut(live_id, code);
  };
  // 登录成功 用户信息 保存到本地
  _login_success = (userInfo) => {
    this.setState({
      isLoading: true
    });
    sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
    // 后台返回数据后才会掉登录接口
    setTimeout(() => {
      this.props.login(userInfo);
      this.props.history.push('/');
      Notification({
        title: '登录成功',
        message: '这是一条成功的提示消息',
        type: 'success'
      });
    }, 3000)
  };
  _onChange = (key, value) => {
    const newForm = {...this.state.form}; // 扩展运算符
    newForm[key] = value;
    this.setState({form: newForm});
    this.forceUpdate();
  };
  _onKeyPress = (event) => {
    const charCode = event.keyCode || event.which;
    if (charCode === 13) {
      event && event.preventDefault(); // eslint-disable-line
      this._onSubmit();
    }
  };

  render() {
    const {isLoading} = this.state;
    return (
      <div className="login">
        <div className='login_form' onKeyPress={this._onKeyPress}>
          <h3>闪电新闻矩阵号</h3>
          {/*<h3>头条视频在线非编平台</h3>*/}
          <Form ref="form" model={this.state.form} rules={this.state.rules} labelWidth="60">
            <Form.Item label="账号" prop="name">
              <Input value={this.state.form.name} onChange={this._onChange.bind(this, 'name')}/>
            </Form.Item>
            <Form.Item label="密码" prop="password">
              <Input type='password' value={this.state.form.password} onChange={this._onChange.bind(this, 'password')}/>
            </Form.Item>
          </Form>
          <Button type="primary" onClick={this._onSubmit} loading={isLoading}> {isLoading ? '登录中' : '登 录'} </Button>
        </div>
      </div>
    );
  }
}

/*
 * connect方法接受两个参数：mapStateToProps和mapDispatchToProps。
 * 它们定义了 UI 组件的业务逻辑。前者负责输入逻辑，即将state映射到 UI 组件的参数（props），
 * 后者负责输出逻辑，即将用户对 UI 组件的操作映射成 Action。
 * */

/*
 * 通过mapDispatchToProps我们在页面调用的方式为`this.props.add()`
 * 如果省略这个 mapDispatchToProps 参数，默认情况下，dispatch 会注入到你的组件 props 中,
 * 则页面的调用方式为`this.props.dispatch(add())`
 * */

export default connect(state => ({admin: state.admin}), {login})(Login);