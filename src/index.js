import React from 'react';
import ReactDOM from 'react-dom';
import './theme/index.css';

import Main from './Main';  // 页面入口
import {store} from './redux/create';
import { Provider } from 'react-redux';

import registerServiceWorker from './registerServiceWorker';

/*
*  <Provider> 来 魔法般的 让所有容器组件都可以访问 store，
*  而不必显示地传递它。只需要在渲染根组件时使用即可。
* */
console.log(store, 'store');
ReactDOM.render(<Provider store={store}><Main /></Provider>, document.getElementById('root'));

registerServiceWorker();
