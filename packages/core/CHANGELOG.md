# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.2.0](https://github.com/namics/gondel/compare/v1.1.2...v1.2.0) (2020-02-19)

**Note:** Version bump only for package @gondel/core





# [1.1.0](https://github.com/namics/gondel/compare/v1.0.0...v1.1.0) (2020-01-16)

**Note:** Version bump only for package @gondel/core





# [1.0.0](https://github.com/namics/gondel/compare/v0.1.0...v1.0.0) (2019-11-28)


### Bug Fixes

* **core:** prevent plugins from being registered twice when being in different js files ([66aedec](https://github.com/namics/gondel/commit/66aedec)), closes [#48](https://github.com/namics/gondel/issues/48)


### BREAKING CHANGES

* **core:** enhances structure of pluginEvents object to track if a plugin (in another js file) has already been initialized





# [0.1.0](https://github.com/namics/gondel/compare/v0.0.8...v0.1.0) (2019-04-08)

**Note:** Version bump only for package @gondel/core





## [0.0.8](https://github.com/namics/gondel/compare/v0.0.7...v0.0.8) (2018-11-19)

**Note:** Version bump only for package @gondel/core





## [0.0.7](https://github.com/namics/gondel/compare/v0.0.6...v0.0.7) (2018-11-05)


### Bug Fixes

* **core:** Overwrite currentTarget using a getter ([41a859f](https://github.com/namics/gondel/commit/41a859f)), closes [#11](https://github.com/namics/gondel/issues/11)
* **core:** Prevent errors during the event handling ([a560c64](https://github.com/namics/gondel/commit/a560c64))





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
