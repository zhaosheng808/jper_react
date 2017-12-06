/**
 * Created by DELL on 2017/11/13.
 */
import React, { Component } from 'react';
import {Link} from 'react-router-dom'
export default class NotFound extends Component {
  render() {
    return (
      <div className="NotFound">
        <h1>404 page</h1>
        <Link to="/">返回首页</Link>
      </div>
    );
  }
}
