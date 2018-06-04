import { startComponents } from '@gondel/core';
import { initEventPlugin } from '@gondel/plugin-events';
import { hot } from '@gondel/plugin-hot';
import { initMediaQueriesPlugin } from '@gondel/plugin-media-queries';
import './components/button';

hot(module);
initEventPlugin();

initMediaQueriesPlugin({
  breakPoints: {
    xxsmall: 480,
    xsmall: 768,
    small: 992,
    medium: 1240,
    large: 1440,
    xlarge: 1920,
    xxlarge: Infinity,
  }
});

startComponents();

