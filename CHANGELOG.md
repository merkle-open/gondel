# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="0.0.6"></a>
## [0.0.6](https://github.com/namics/gondel/compare/v0.0.5...v0.0.6) (2018-09-25)


### Features

* **core:** Allow to type _ctx ([0ee58fe](https://github.com/namics/gondel/commit/0ee58fe))


### BREAKING CHANGES

* **core:** GondelBaseComponent constructor requires a ctx and a componentName argument





<a name="0.0.5"></a>
## [0.0.5](https://github.com/namics/gondel/compare/v0.0.4...v0.0.5) (2018-09-19)


### Bug Fixes

* **core:** Allow to stop any node with stopComponents ([4586f89](https://github.com/namics/gondel/commit/4586f89))





<a name="0.0.4"></a>
## [0.0.4](https://github.com/namics/gondel/compare/v0.0.1...v0.0.4) (2018-09-17)


### Bug Fixes

* **@gondel/core:** Rethrow caught errors from promises for better dev tool output ([6de6c5f](https://github.com/namics/gondel/commit/6de6c5f))
* **core:** Allow to overwrite the stop method ([83946fd](https://github.com/namics/gondel/commit/83946fd))
* Update path for HtmlWebpackPlugin template in typescript example ([9ee3ae2](https://github.com/namics/gondel/commit/9ee3ae2))
* **core:** Fix Element is undefined in jest ([ba71f7c](https://github.com/namics/gondel/commit/ba71f7c))
* **plugin-jquery:** Fix a typo in the classname ([5b3a447](https://github.com/namics/gondel/commit/5b3a447))
* **plugin-react:** Fix a possible invalid type error ([9622d7d](https://github.com/namics/gondel/commit/9622d7d))


### Features

* Upgrade dependencies ([#13](https://github.com/namics/gondel/issues/13)) ([228c287](https://github.com/namics/gondel/commit/228c287))
* **core:** Start all components on dom ready ([12f4b64](https://github.com/namics/gondel/commit/12f4b64))
* **dom-utils:** add the possibility of generic params for dom utils ([63d3785](https://github.com/namics/gondel/commit/63d3785))
* **dom-utils:** refactor getComponentByDomNode for strict typings ([deaf717](https://github.com/namics/gondel/commit/deaf717))
* **events:** Set event.currentTarget to the selected element of the listener ([03a0152](https://github.com/namics/gondel/commit/03a0152))
* **plugin-jquery:** Provide a mixin and a baseClass ([504bdf4](https://github.com/namics/gondel/commit/504bdf4))
* **plugin-media-query:** create media-queries gondel plugin ([#2](https://github.com/namics/gondel/issues/2)) ([5c36e04](https://github.com/namics/gondel/commit/5c36e04))
* **plugin-media-query:** Export the event name as variable name ([4af8458](https://github.com/namics/gondel/commit/4af8458)), closes [#4](https://github.com/namics/gondel/issues/4)
* **plugin-react:** Release the gondel react plugin ([d7c14dd](https://github.com/namics/gondel/commit/d7c14dd))


### BREAKING CHANGES

* **events:** Set event.currentTarget to the selected element of the listener
* **dom-utils:** getComponentByDomNode will now throw an error if no component can be found
* **plugin-media-query:** The event named viewportChange was removed and is now only accessible using the
exported VIEWPORT_ENTERED constant





<a name="0.0.2"></a>
## [0.0.2](https://github.com/namics/gondel/compare/v0.0.1...v0.0.2) (2018-05-25)


### Bug Fixes

* **core:** Allow to overwrite the stop method ([83946fd](https://github.com/namics/gondel/commit/83946fd))
