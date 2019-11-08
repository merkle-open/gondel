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

[Hello World Example](https://codesandbox.io/s/github/namics/gondel/tree/master/examples/hello-world)

## Module format 

Gondel follows the [rollup recommendations](https://github.com/rollup/rollup/wiki/pkg.module) which includes on the one hand ESM for bundle size optimisations and on the other hand a UMD version to be compatible with every former javascript bundling/concatenation strategy.

Gondel is fully typed and exports optional typescript declaration files for typescript projects.

## Plugins

- [Media Queries Plugin](https://github.com/namics/gondel/tree/master/packages/plugins/media-queries) - Provide a custom gondel event which will fire once a given media query is met - [Demo](https://codesandbox.io/s/github/namics/gondel/tree/master/examples/media-query-plugin)

## Playground

https://codesandbox.io/s/github/namics/gondel/tree/master/examples/hello-world

## Examples

+ [Hello World](https://codesandbox.io/s/github/namics/gondel/tree/master/examples/hello-world)
+ [Chunk Splitting](https://codesandbox.io/s/github/namics/gondel/tree/master/examples/lazy-load)
+ [Star Rating](https://codesandbox.io/s/github/namics/gondel/tree/master/examples/five-star)
+ [Gondel with Typescript](https://codesandbox.io/s/github/namics/gondel/tree/master/examples/typescript)
+ [Using Gondel from React](https://codesandbox.io/s/github/namics/gondel/tree/master/examples/react-gondel)
+ [Using React from Gondel](https://codesandbox.io/s/github/namics/gondel/tree/master/examples/render-jsx)
+ [Communication getComponentByDomNode](https://codesandbox.io/s/github/namics/gondel/tree/master/examples/get-component-by-dom-node)
+ [Communication findComponents](https://codesandbox.io/s/github/namics/gondel/tree/master/examples/find-components)
+ [Communication triggerPublicEvent](https://codesandbox.io/s/github/namics/gondel/tree/master/examples/trigger-public-event)
+ [Plugin Data](https://codesandbox.io/s/github/namics/gondel/tree/master/examples/plugin-data)
+ [Plugin Media Queries](https://codesandbox.io/s/github/namics/gondel/tree/master/examples/plugin-media-query)
+ [Plugin Resize](https://codesandbox.io/s/github/namics/gondel/tree/master/examples/plugin-resize)

## Contributing to Gondel

All contributions are welcome: use-cases, documentation, code, patches, bug reports, feature requests, etc.  
The following commands will get you started to work locally:

```
npm install
npm run build
```

Running tests:

```
npm run test:watch
```

Thanks to all who have contributed ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)) so far:

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars2.githubusercontent.com/u/4113649?v=4" width="100px;"/><br /><sub><b>Jan Nicklas</b></sub>](https://twitter.com/jantimon)<br />[💻](https://github.com/namics/gondel/commits?author=jantimon "Code") [📖](https://github.com/namics/gondel/commits?author=jantimon "Documentation") [🐛](https://github.com/namics/gondel/issues?q=author%3Ajantimon "Bug reports") [💡](#example-jantimon "Examples") [🚇](#infra-jantimon "Infrastructure (Hosting, Build-Tools, etc)") [🔌](#plugin-jantimon "Plugin/utility libraries") [⚠️](https://github.com/namics/gondel/commits?author=jantimon "Tests") [👀](#review-jantimon "Reviewed Pull Requests") | [<img src="https://avatars1.githubusercontent.com/u/149406?v=4" width="100px;"/><br /><sub><b>Ernst Ammann</b></sub>](https://github.com/ernscht)<br />[💻](https://github.com/namics/gondel/commits?author=ernscht "Code") [📖](https://github.com/namics/gondel/commits?author=ernscht "Documentation") [🚇](#infra-ernscht "Infrastructure (Hosting, Build-Tools, etc)") [📦](#platform-ernscht "Packaging/porting to new platform") [👀](#review-ernscht "Reviewed Pull Requests") | [<img src="https://avatars1.githubusercontent.com/u/9339019?v=4" width="100px;"/><br /><sub><b>Dušan Perković</b></sub>](https://github.com/noblica)<br />[💻](https://github.com/namics/gondel/commits?author=noblica "Code") [📖](https://github.com/namics/gondel/commits?author=noblica "Documentation") [🔌](#plugin-noblica "Plugin/utility libraries") [🤔](#ideas-noblica "Ideas, Planning, & Feedback") [⚠️](https://github.com/namics/gondel/commits?author=noblica "Tests") | [<img src="https://avatars1.githubusercontent.com/u/4563751?v=4" width="100px;"/><br /><sub><b>Jan R. Biasi</b></sub>](https://aviormusic.com)<br />[💻](https://github.com/namics/gondel/commits?author=janbiasi "Code") [📖](https://github.com/namics/gondel/commits?author=janbiasi "Documentation") [🤔](#ideas-janbiasi "Ideas, Planning, & Feedback") [⚠️](https://github.com/namics/gondel/commits?author=janbiasi "Tests") [👀](#review-janbiasi "Reviewed Pull Requests") | [<img src="https://avatars1.githubusercontent.com/u/3381820?v=4" width="100px;"/><br /><sub><b>Jan Widmer</b></sub>](https://github.com/janwidmer)<br />[💻](https://github.com/namics/gondel/commits?author=janwidmer "Code") [📖](https://github.com/namics/gondel/commits?author=janwidmer "Documentation") [💡](#example-janwidmer "Examples") [🤔](#ideas-janwidmer "Ideas, Planning, & Feedback") [🔌](#plugin-janwidmer "Plugin/utility libraries") | [<img src="https://avatars1.githubusercontent.com/u/3457712?v=4" width="100px;"/><br /><sub><b>Claudio Bianucci</b></sub>](https://github.com/chezdev)<br />[💻](https://github.com/namics/gondel/commits?author=chezdev "Code") [🤔](#ideas-chezdev "Ideas, Planning, & Feedback") |
| :---: | :---: | :---: | :---: | :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

### License

[MIT license](./LICENSE)

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
