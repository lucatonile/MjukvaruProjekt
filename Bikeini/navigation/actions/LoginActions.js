import { LOGIN } from './types';

export const login = credentials => (
  {
    type: LOGIN,
    payload: credentials,
  }
);
