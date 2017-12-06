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

import { connect } from 'react-redux';
// import * as action from '../../redux/actions';
import {login} from '@/redux/models/admin';
import {add} from '@/redux/models/other';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {};
  }
  componentDidMount(){
    // this.props.dispatch(action.hi());
    // console.log(this.state, 'state');
    // console.log(this.props, 'props');
    // console.log(login, 'login');
  }
  _changeName = () => {
    // this.props.dispatch(add())
    this.props.add();
  };
  render() {
    const contentStyle = {
      boxSizing: 'border-box',
      padding: '10px'
    };
    const {number} = this.props;
    // const { name = '未定义' } = this.props;
    return (
      <div className="App">
        <div className="app-content" style={contentStyle}>
          <h1 style={{borderBottom:'1px solid #333'}}>app-content</h1>
          <h2>number: {number}</h2>
          <button onClick={this._changeName}>add 1</button>
          <Switch>
            <Route exact path="/" component={Dashboard}/>
            <Route path="/dashboard" component={Dashboard}/>
            <Route path="/home" component={Home}/>
            <Route path="/404" component={NotFound}/>
            <Redirect path="*" to="404"/>
            {/*<Route component={NotFound}/>*/}
          </Switch>
        </div>
      </div>
    );
  }
}



export default connect(state => ({admin: state.admin, number: state.other.number}), {login, add}, null, {pure: false})(App);