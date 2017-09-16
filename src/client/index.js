import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';

document.addEventListener('DOMContentLoaded', function () {
  ReactDOM.render(
    <App />,
    document.getElementById('mount')
  );
});

if (module.hot) {
  module.hot.accept();
}
