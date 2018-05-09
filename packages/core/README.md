[![NPM version][npm-image]][npm-url] 
[![Build Status][travis-image]][travis-url]
[![Size][size-image]][size-url]
[![License][license-image]][license-url] 
[![Commitizen friendly][commitizen-image]][commitizen-url] 
[![Prettier](https://img.shields.io/badge/Code%20Style-Prettier-green.svg)](https://github.com/prettier/prettier)

# 🚡 Gondel

[Gondel](https://en.wikipedia.org/wiki/Gondola) is a tiny (2kb) library to bootstrap frontend components.  
With gondel you will be able to build high quality components for SPAs and enterprise backend solutions.  
Gondel components can be used with React, Angular and even third party markup (Java, C#, PHP, ...).

# ⚠ Caution ⚠

Please be aware that this project is currently in alpha stage.

# Demo

This demo will listen to all `change` events coming from elements with `data-g-name="Input"` and will add/remove a `has-content` class.

HTML

```html
 <input data-g-name="Input" />
 <input data-g-name="Input" />
```

JS

```js
import {component, event, GondelBaseComponent} from '@gondel/core';

// The @Component decorator will connect the class with `data-g-name="Input"` elements.
@Component('Input')
export class Input extends GondelBaseComponent {

  @EventListener('change') 
  _handleChange(event) {
    // this._ctx is automatically set to the html element with the data-g-name attribute
    this._ctx.classList.toggle("has-content", this._ctx.value.length > 0);
  }
}
```

# Module format 

Gondel follows the [rollup recommendations](https://github.com/rollup/rollup/wiki/pkg.module) which includes on the one hand ESM for bundle size optimisations and on the other hand a UMD version to be compatible with every former javascript bundling/concatenation strategy.

Gondel is fully typed and exports optional typescript declaration files for typescript projects.

# Contributing to Gondel

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

# Playground

https://stackblitz.com/fork/gondel

# Examples

+ Gondel 5 Star - https://stackblitz.com/edit/gondel-5-star

## License

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
