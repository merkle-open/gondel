# MediaQueries Plugin

[![NPM version][npm-image]][npm-url] 
[![Size][size-image]][size-url]
[![License][license-image]][license-url] 
[![Commitizen friendly][commitizen-image]][commitizen-url] 
[![Prettier](https://img.shields.io/badge/Code%20Style-Prettier-green.svg)](https://github.com/prettier/prettier)

## Installation

```js
import {initMediaQueriesPlugin} from '@gondel/plugin-media-queries';

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
```

Please note: the provided breakpoints need to be the maximum value of each viewport in px.

## Viewport entered

```js
  import { VIEWPORT_ENTERED } from '@gondel/plugin-media-queries';
```

The general viewport entered event is fired if the viewport switches into one of the provided breakpoints

```js
  @EventListener(VIEWPORT_ENTERED)
  handleViewportChange(event) {
     console.log(event.viewport);
  }
```

## Restrict to certain viewport

Additionally, the event listener can be restricted to just one specific viewport

```js
  @EventListener(VIEWPORT_ENTERED, 'medium')
  handleViewportChange(event) {
     console.log('You are now on the medium viewport');
  }
```

## getCurrentViewport

```js
  import { getCurrentViewport } from '@gondel/plugin-media-queries';
```

Additionally you can always get the current viewport name by using the
`getCurrentViewport` helper.

```js
start() {
  console.log(getCurrentViewport());
  // output's e.g. "medium"
}
```

# Known Issues

The `initMediaQueriesPlugin` has to be called you call `startComponents`.

## License

[MIT license](http://opensource.org/licenses/MIT)

[npm-image]: https://badge.fury.io/js/%40gondel%2Fplugin-media-queries.svg
[npm-url]: https://npmjs.org/package/@gondel/plugin-media-queries
[license-image]: https://img.shields.io/badge/license-MIT-green.svg
[license-url]: http://opensource.org/licenses/MIT
[commitizen-image]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]: http://commitizen.github.io/cz-cli/
[size-image]: http://img.badgesize.io/namics/gondel/master/packages/media-queries/dist/index.es5.min.js.svg?compression=gzip&label=gzip%20size
[size-url]: https://unpkg.com/@gondel/plugin-media-queries/dist/index.es5.min.js
