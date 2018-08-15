import {startComponents} from '@gondel/core';
import {initMediaQueriesPlugin} from '@gondel/plugin-media-queries';
import './components/current-viewport';

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



