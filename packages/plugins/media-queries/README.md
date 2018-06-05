# MediaQueries Plugin

Installation

```
import {initMediaQueriesPlugin} from '@gondel/plugin-media-queries';

const breakPoints = {
	xxsmall: 480,
	xsmall: 768,
	small: 992,
	medium: 1240,
	large: 1440,
	xlarge: 1920,
	xxlarge: Infinity,
};

initMediaQueriesPlugin(breakPoints);
```

Please note: the provided breakpoints need to be the maximum value of each viewport in px.

## Viewport change

The general viewport change event is fired if the viewport matches one of the provided breakpoints

```js
  @EventListener('viewportChange')
  handleViewportChange(event) {
     console.log(event.viewPort);
  }
```

## Restrict to certain viewport

Additionally, the event listener can be restricted to just one specific viewport

```js
  @EventListener('viewportChange', 'medium')
  handleViewportChange(event) {
     console.log(event.viewPort);
  }
```

## getCurrentViewport

Additionally, the currentViewport get's stored in a variable upon the setup callback for
every breakpoint and is available within the start / sync method of a gondel component

```
start() {
  console.log(getCurrentViewport());
  // output's e.g. "medium"
}
```

# Known Issues

The `initMediaQueriesPlugin` has to be called before any component is registered.

# Built With

* [Enquire.js](https://github.com/WickyNilliams/enquire.js) - The js media queries plugin
