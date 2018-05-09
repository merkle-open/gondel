import {startComponents} from '@gondel/core';
import {hot} from '@gondel/plugin-hot';
import {initEventPlugin} from '@gondel/plugin-events';

import './components/button';

hot(module);
initEventPlugin();

startComponents();

