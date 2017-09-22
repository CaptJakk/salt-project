import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';
import HomePage from './HomePage.jsx';
import LoginPage from './LoginPage.jsx';
import store from '../store.js';

export default class App extends React.Component {
  render () {
    return (
      <Provider store={store}>
        <div>
          <Route
            exact
            path='/'
            component={(props) => window.sessionStorage.getItem('jwt') ? <Redirect to='/home' /> : <Redirect to='/login' />}
          />
          <Route
            exact
            path='/home'
            component={HomePage}
          />
          <Route
            exact
            path='/login'
            component={LoginPage}
          />
          <Route
            exact
            path='/register'
            component={props => <LoginPage isRegister />}
          />
        </div>
      </Provider>
    );
  }
}
