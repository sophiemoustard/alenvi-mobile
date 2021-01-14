import React from 'react';
import axios from 'axios';
import { createStore } from 'redux';
import { Provider as ReduxProvider } from 'react-redux';
import MockAdapter from 'axios-mock-adapter';
import { render, fireEvent, waitFor } from 'react-native-testing-library';
import { Provider as AuthProvider } from '../src/context/AuthContext';
import getEnvVars from '../environment';
import reducers from '../src/store/index';
import AppContainer from '../src/AppContainer';

describe('Authentication tests', () => {
  let axiosMock;
  beforeEach(() => {
    axiosMock = new MockAdapter(axios);
  });

  afterEach(() => {
    axiosMock.reset();
  });

  test('user should authenticate and be redirected to Home page', async () => {
    const { baseURL } = getEnvVars();
    const store = createStore(reducers);
    axiosMock.onPost(`${baseURL}/users/authenticate`).reply(
      200,
      { data: { token: 'token', tokenExpireDate: '123', refreshToken: 'refresh-token', user: { _id: '321' } } }
    );
    axiosMock.onGet(`${baseURL}/users/321`).reply(200, { data: { user: { _id: '321' } } });

    const element = render(
      <AuthProvider>
        <ReduxProvider store={store}>
          <AppContainer/>
        </ReduxProvider>
      </AuthProvider>
    );

    const emailInput = await waitFor(() => element.getByTestId('Email'));
    fireEvent.changeText(emailInput, 'test@alenvi.io');

    const passwordInput = await waitFor(() => element.getByTestId('Mot de passe'));
    fireEvent.changeText(passwordInput, '123456');

    const sendButton = await waitFor(() => element.getByTestId('Se connecter'));
    fireEvent.press(sendButton);

    const header = await waitFor(() => element.getByTestId('header'));

    expect(header).toBeTruthy();
  });
});
