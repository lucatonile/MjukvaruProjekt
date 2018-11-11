/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import loginReducer from './navigation/reducers/LoginReducers';
import AppNavigator from './navigation/AppNavigator';


const store = createStore(loginReducer);

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <AppNavigator />
      </Provider>
    );
  }
}
