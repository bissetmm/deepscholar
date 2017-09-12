import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/App/index.js';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import {reducers} from './module';

import registerServiceWorker from './registerServiceWorker';

const store = createStore(reducers);
ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root'));
registerServiceWorker();
