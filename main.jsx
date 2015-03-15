import React from 'react';
import App from './app/App.jsx';

function t(a: Array) {
  console.log(a);
}

t([1, 2, 3]);

React.render(<App />, document.getElementById('app'));