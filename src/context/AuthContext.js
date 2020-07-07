import { AsyncStorage } from 'react-native';
import createDataContext from './createDataContext';
import Users from '../api/users';
import { navigate } from '../navigationRef';

const authReducer = (state, actions) => {
  switch (actions.type) {
    case 'beforeSignin':
      return { ...state, error: false, errorMessage: '', loading: true };
    case 'signin':
      return { ...state, loading: false, token: actions.payload };
    case 'signinError':
      return { ...state, loading: false, error: true, errorMessage: actions.payload };
    case 'resetError':
      return { ...state, loading: false, error: false, errorMessage: '' };
    case 'signout':
      return { ...state, token: null, loading: false, error: false, errorMessage: '' };
    case 'render':
      return { ...state, appIsReady: true };
    default:
      return state;
  }
};

const signIn = dispatch => async ({ email, password }) => {
  try {
    dispatch({ type: 'beforeSignin' });
    if (!email || !password) return;

    const authentication = await Users.authenticate({ email, password });
    await AsyncStorage.setItem('token', authentication.token);
    dispatch({ type: 'signin', payload: authentication.token });
    navigate('Home', { screen: 'CourseList' });
  } catch (e) {
    dispatch({
      type: 'signinError',
      payload: e.response.status === 401
        ? 'L\'email et/ou le mot de passe est incorrect.'
        : 'Impossible de se connecter'
    });
  }
};

const signOut = dispatch => async () => {
  await AsyncStorage.removeItem('token');
  dispatch({ type: 'signout' });
  navigate('Authentication');
};

const tryLocalSignIn = dispatch => async () => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    dispatch({ type: 'signin', payload: token });
    navigate('Home', { screen: 'CourseList' });
  }
  dispatch({ type: 'render' });
};

const resetError = dispatch => () => {
  dispatch({ type: 'resetError' });
};

export const { Provider, Context } = createDataContext(
  authReducer,
  { signIn, tryLocalSignIn, signOut, resetError },
  { token: null, loading: false, error: false, errorMessage: '', appIsReady: false }
);
