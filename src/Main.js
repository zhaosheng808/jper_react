/**
 * Created by DELL on 2017/11/10.
 */
import React, { Component } from 'react'


import {
  HashRouter as Router,
  Switch,
  Redirect,
  Route
} from 'react-router-dom';
import { connect } from 'react-redux';

import {login} from '@/redux/models/admin';
import App from './containers/App'
import Login from './containers/Login'


class Main extends Component {
  constructor(props){
    super(props);
    this.state = {
    };
  }
  componentWillMount() {
    /*
    * 刷新会导致用户数据丢失,
    * 如果有本地数据，需要将用户信息从本地储存中加载到redux中
    * */
    if (sessionStorage.userInfo) {
      const userInfo = JSON.parse(sessionStorage.userInfo);
      this.props.login(userInfo);
    }
  }
  _authLogin = () => {
    let sessionStorage_userInfo = {};
    if (sessionStorage.userInfo) {
      sessionStorage_userInfo = JSON.parse(sessionStorage.userInfo);
    }
    const { uuid = '' } = this.props.admin;
    if (uuid || sessionStorage_userInfo.uuid) {
      return <App />
    } else {
      return <Redirect to={{pathname: '/login'}}/>
    }
  };
  render() {
    const routerWrapper = {
      height: '100%'
    };
    return (
      <Router>
        <div className="router_wrapper" style={routerWrapper}>
          <Switch>
            <Route exact path="/login" component={Login} />
            {/*<Route path="/" component={App} />*/}
            <Route path="/" render={() => this._authLogin()}/>
          </Switch>
        </div>
      </Router>
    )
  }
}
export default connect(state => ({
  admin: state.admin
}),
  {login})(Main);