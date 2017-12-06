/**
 * Created by DELL on 2017/11/10.
 */
import React, { Component } from 'react'
import {
  HashRouter as Router,
  Switch,
  Route
} from 'react-router-dom'

import App from '../containers/App'
import Login from '../containers/Login'
import Home from '../containers/Home'

export default
class Main extends Component {
  render() {
    const routerWrapper = {
      height: '100%'
    };
    return (
      <Router>
        <div className="router_wrapper" style={routerWrapper}>
          <Switch>
            <Route exact path="/login" component={Login}/>
            <Route exact path="/home2" component={Home}/>
            <Route path="/" component={App}/>
          </Switch>
        </div>
      </Router>
    )
  }
}