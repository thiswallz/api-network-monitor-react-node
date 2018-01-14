import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import {
  createStore,
  applyMiddleware,
  compose
} from 'redux';
import ReduxPromise from "redux-promise";

import App from './components/app';
import store from './store';

const createStoreWithMiddleware = compose(applyMiddleware(thunk))(createStore);
 
ReactDOM.render(
  <Provider store={createStoreWithMiddleware(store)}>
    <App />
  </Provider>
  , document.querySelector('.container'));
