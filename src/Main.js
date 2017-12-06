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
import App from './containers/App'
import Login from './containers/Login'

class Main extends Component {
  constructor(props){
    super(props);
    this.state = {
    };
  }
  _authLogin = () => {
    console.log(this.props.admin, 'admin');
    const { username = 'aaa' } = this.props.admin;
    if (username) {
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
export default connect(state => state)(Main);