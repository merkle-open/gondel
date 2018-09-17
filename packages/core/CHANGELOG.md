# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="0.0.4"></a>
## [0.0.4](https://github.com/namics/gondel/compare/v0.0.1...v0.0.4) (2018-09-17)


### Bug Fixes

* **@gondel/core:** Rethrow caught errors from promises for better dev tool output ([6de6c5f](https://github.com/namics/gondel/commit/6de6c5f))
* **core:** Allow to overwrite the stop method ([83946fd](https://github.com/namics/gondel/commit/83946fd))
* **core:** Fix Element is undefined in jest ([ba71f7c](https://github.com/namics/gondel/commit/ba71f7c))


### Features

* Upgrade dependencies ([#13](https://github.com/namics/gondel/issues/13)) ([228c287](https://github.com/namics/gondel/commit/228c287))
* **core:** Start all components on dom ready ([12f4b64](https://github.com/namics/gondel/commit/12f4b64))
* **dom-utils:** add the possibility of generic params for dom utils ([63d3785](https://github.com/namics/gondel/commit/63d3785))
* **dom-utils:** refactor getComponentByDomNode for strict typings ([deaf717](https://github.com/namics/gondel/commit/deaf717))
* **events:** Set event.currentTarget to the selected element of the listener ([03a0152](https://github.com/namics/gondel/commit/03a0152))
* **plugin-media-query:** create media-queries gondel plugin ([#2](https://github.com/namics/gondel/issues/2)) ([5c36e04](https://github.com/namics/gondel/commit/5c36e04))


### BREAKING CHANGES

* **events:** Set event.currentTarget to the selected element of the listener
* **dom-utils:** getComponentByDomNode will now throw an error if no component can be found
