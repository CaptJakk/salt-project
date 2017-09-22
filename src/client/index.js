import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './components/App.jsx';

document.addEventListener('DOMContentLoaded', function () {
  ReactDOM.render(
    <BrowserRouter><App /></BrowserRouter>,
    document.getElementById('mount')
  );
});

/*
if (module.hot) {
  module.hot.accept();
}
*/
