# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.2.5](https://github.com/namics/gondel/compare/v1.2.4...v1.2.5) (2020-11-16)


### Bug Fixes

* allow to stop components in namespaces with long names ([20af9c0](https://github.com/namics/gondel/commit/20af9c09efc4992d48cbc7c300babcffc1db3382))





## [1.2.4](https://github.com/namics/gondel/compare/v1.2.3...v1.2.4) (2020-09-21)


### Bug Fixes

* **examples:** examples work on codesandbox again ([097c325](https://github.com/namics/gondel/commit/097c32566bd5e982237aa4f1d4a5c1e76fca5ed8))
* **hot plugin:** allow passing a node module ([7be34f6](https://github.com/namics/gondel/commit/7be34f699fb4ae5dc88b530171714c3630aea8ee))
* add experimentalDecorators config to examples ([694a1d4](https://github.com/namics/gondel/commit/694a1d496ed7aa962dbd9683fdd2d598a92f63e2))
* add experimentalDecorators config to examples ([7ad1bcf](https://github.com/namics/gondel/commit/7ad1bcfca0563629262cc712a935b1cdc194cfd0))





## [1.2.3](https://github.com/namics/gondel/compare/v1.2.2...v1.2.3) (2020-03-09)


### Bug Fixes

* **react plugin:** export typescript interface for better ide support ([fa87524](https://github.com/namics/gondel/commit/fa875240eb64d76bdcbb3427d27b10f4323ffc31))





## [1.2.2](https://github.com/namics/gondel/compare/v1.2.1...v1.2.2) (2020-03-09)


### Bug Fixes

* **react plugin:** export typescript interface for better ide support ([2aebda5](https://github.com/namics/gondel/commit/2aebda56160bbd5d831c9ca5137731d1ec2d035b))





## [1.2.1](https://github.com/namics/gondel/compare/v1.2.0...v1.2.1) (2020-03-09)


### Bug Fixes

* **react plugin:** export typescript interface for better ide support ([753259d](https://github.com/namics/gondel/commit/753259d45dbdf99c966bab937156db3a9ffae43d))





# [1.2.0](https://github.com/namics/gondel/compare/v1.1.2...v1.2.0) (2020-02-19)


### Features

* **react plugin:** provide a factory function to connect Gondel and React ([c6ac867](https://github.com/namics/gondel/commit/c6ac867ad9841f09d90dda18a9fbb77fb83f6dce))





## [1.1.2](https://github.com/namics/gondel/compare/v1.1.1...v1.1.2) (2020-01-16)


### Bug Fixes

* **react plugin:** allow to set the wrapper html element ([56e8f16](https://github.com/namics/gondel/commit/56e8f16))





## [1.1.1](https://github.com/namics/gondel/compare/v1.1.0...v1.1.1) (2020-01-16)


### Bug Fixes

* **react plugin:** provide default type for State ([d388473](https://github.com/namics/gondel/commit/d388473))





# [1.1.0](https://github.com/namics/gondel/compare/v1.0.0...v1.1.0) (2020-01-16)


### Features

* **react plugin:** add async linkining support to the gondel react plugin ([b39ca5a](https://github.com/namics/gondel/commit/b39ca5a))





# [1.0.0](https://github.com/namics/gondel/compare/v0.1.0...v1.0.0) (2019-11-28)


### Bug Fixes

* **core:** prevent plugins from being registered twice when being in different js files ([66aedec](https://github.com/namics/gondel/commit/66aedec)), closes [#48](https://github.com/namics/gondel/issues/48)


### Features

* **plugin resize:** enhance readme and export interface for component dimensions ([#52](https://github.com/namics/gondel/issues/52)) ([fe86c2c](https://github.com/namics/gondel/commit/fe86c2c))


### BREAKING CHANGES

* **core:** enhances structure of pluginEvents object to track if a plugin (in another js file) has already been initialized





# [0.1.0](https://github.com/namics/gondel/compare/v0.0.8...v0.1.0) (2019-04-08)


### Features

* **resize plugin:** add resize plugin ([#39](https://github.com/namics/gondel/issues/39)) ([26df627](https://github.com/namics/gondel/commit/26df627))
* **website:** add page about gondel communication ([#47](https://github.com/namics/gondel/issues/47)) ([64ff049](https://github.com/namics/gondel/commit/64ff049))





## [0.0.8](https://github.com/namics/gondel/compare/v0.0.7...v0.0.8) (2018-11-19)


### Features

* **react-plugin:** Allow to skip the render method for pure linking components ([3e1c4d7](https://github.com/namics/gondel/commit/3e1c4d7))





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
