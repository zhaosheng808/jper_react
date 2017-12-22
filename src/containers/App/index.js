import React, {Component} from 'react';
// import { Button } from 'antd';
import {
  // HashRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';

import Dashboard from '../Dashboard'
import NotFound from '../NotFound'
import Home from '../Home'
import './App.css';

import {connect} from 'react-redux';
// import * as action from '../../redux/actions';
import {login} from '@/redux/models/admin';
import {add} from '@/redux/models/other';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
  }

  _changeName = () => {

    this.props.add();
  };

  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path="/" component={Dashboard}/>
          <Route path="/dashboard" component={Dashboard}/>
          <Route path="/home" component={Home}/>
          <Route path="/404" component={NotFound}/>
          <Redirect path="*" to="404"/>
          {/*<Route component={NotFound}/>*/}
        </Switch>
      </div>
    );
  }
}


export default connect(state => ({admin: state.admin, number: state.other.number}), {
  login,
  add
}, null, {pure: false})(App);