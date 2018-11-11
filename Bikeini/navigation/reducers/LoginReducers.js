import { combineReducers } from 'redux';
import { LOGIN } from '../actions/types';

const LOGIN_STATE = {
  isLoggedIn: false,
  username: '',
  password: '',
};
/*
const handleLogin = (state) => {
  const { userName, password } = state;
  // TODO: validate credentials
  return state;
};
*/
const loginReducer = (state = LOGIN_STATE, action) => {
  switch (action.type) {
    case LOGIN:
      return state;
    default:
      return state;
  }
};

export default combineReducers({
  loginState: loginReducer,
});
