/**
 * Created by DELL on 2017/11/10.
 */
import React, { Component } from 'react';
import {
  Switch,
  Link,
  Route
} from 'react-router-dom';
import Homename from './HomeName'
export default
class Home extends Component {
  render() {
    return (
      <div className="dashboard">
        <h1>Home</h1>
        <p className="App-intro">
          主页
        </p>
        <Link to='/home/xiaoming'>小明之家2</Link>
        <Switch>
          <Route path="/home/:name" component={Homename}/>
        </Switch>
      </div>
    );
  }
}
