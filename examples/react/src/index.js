import * as ReactDOM from 'react-dom';
import * as React from 'react';
import {startComponents} from '@gondel/core';
import {hot} from '@gondel/plugin-hot';
import {initEventPlugin} from '@gondel/plugin-events';
import App from './app.jsx';

hot(module);
initEventPlugin();

startComponents();
ReactDOM.render(React.createElement(App, null), document.getElementById('root'));

