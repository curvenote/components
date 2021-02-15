import { applyMiddleware, createStore, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import runtime, { types } from '@curvenote/runtime';
import { register } from './src/components';
import './src/index.css';
import './index.css';

declare global {
  interface Window {
    curvenote: {
      store: types.Store;
    }
  }
}

window.curvenote = {
  ...window.curvenote,
  store: createStore(
    combineReducers({ runtime: runtime.reducer }),
    applyMiddleware(
      thunkMiddleware,
      runtime.triggerEvaluate,
      runtime.dangerousEvaluatation,
    ),
  ) as types.Store,
};

register(window.curvenote.store);
