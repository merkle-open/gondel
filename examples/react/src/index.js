import { startComponents } from '@gondel/core';
import { hot } from '@gondel/plugin-hot';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './app.jsx';

hot(module);
startComponents();

ReactDOM.render(React.createElement(App, null), document.getElementById('root'));

