[![NPM version][npm-image]][npm-url] 
[![Build Status][travis-image]][travis-url]
[![Size][size-image]][size-url]
[![License][license-image]][license-url] 
[![Commitizen friendly][commitizen-image]][commitizen-url] 
[![Prettier](https://img.shields.io/badge/Code%20Style-Prettier-green.svg)](https://github.com/prettier/prettier)

# 🚡 Gondel

[Gondel](https://en.wikipedia.org/wiki/Gondola) is a tiny (2kb) non-intrusive library to help you modularize your code.  
It does **not** ship with a rendering engine to be a perfect fit for most client side rendering engines (e.g. React or Angular) and server side rendering engines (e.g. Java or PHP)

## Installation

```bash
npm i @gondel/core
```

## Hello World

This button will listen to all `click events` events coming from all elements with `data-g-name="Button"` and will
show an alert message.

HTML

```html
 <button data-g-name="Button">Click me</button>

 <button data-g-name="Button">Or click me</button>
```

JS

```js
import {Component, EventListener, GondelBaseComponent} from '@gondel/core';

// The @Component decorator will connect the class with `data-g-name="Button"` elements.
@Component('Button')
export class Button extends GondelBaseComponent {
  @EventListener('click') 
  _handleChange(event) {
    alert('Hello World')
  }
}
```

## Module format 

Gondel follows the [rollup recommendations](https://github.com/rollup/rollup/wiki/pkg.module) which includes on the one hand ESM for bundle size optimisations and on the other hand a UMD version to be compatible with every former javascript bundling/concatenation strategy.

Gondel is fully typed and exports optional typescript declaration files for typescript projects.

## Plugins

- [Media Queries Plugin](https://github.com/namics/gondel/tree/master/packages/plugins/media-queries) - Provide a custom gondel event which will fire once a given media query is met - [Demo](https://stackblitz.com/edit/gondel-media-query?file=components%2Fbutton.js)

## Contributing to Gondel

Feel free to contribute to gondel.  
The following commands will get you started:

```
npm install
npm run build
```

Running tests:

```
npm run test:watch
```

## Playground

https://stackblitz.com/fork/gondel

## Examples

+ Gondel 5 Star - [https://stackblitz.com/edit/gondel-5-star](https://stackblitz.com/edit/gondel-5-star?file=components%2Frating.js)
+ Chunk Splitting - [https://stackblitz.com/edit/gondel-lazy-load](https://stackblitz.com/edit/gondel-lazy-load?file=components%2Fbutton.js)
+ Media Queries - [CodeSandbox](https://codesandbox.io/s/github/namics/gondel/tree/master/examples/media-query-plugin)

### License

[MIT license](http://opensource.org/licenses/MIT)

[npm-image]: https://badge.fury.io/js/%40gondel%2Fcore.svg
[npm-url]: https://npmjs.org/package/@gondel/core
[travis-image]: https://travis-ci.org/namics/gondel.svg?branch=master
[travis-url]: https://travis-ci.org/namics/gondel
[license-image]: https://img.shields.io/badge/license-MIT-green.svg
[license-url]: http://opensource.org/licenses/MIT
[commitizen-image]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]: http://commitizen.github.io/cz-cli/
[size-image]: http://img.badgesize.io/namics/gondel/master/packages/core/dist/gondel.es5.min.js.svg?compression=gzip&label=gzip%20size
[size-url]: https://unpkg.com/@gondel/core/dist/gondel.es5.min.js
