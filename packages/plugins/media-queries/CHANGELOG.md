# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="0.0.6"></a>
## [0.0.6](https://github.com/namics/gondel/compare/v0.0.5...v0.0.6) (2018-09-25)

**Note:** Version bump only for package @gondel/plugin-media-queries





<a name="0.0.5"></a>
## [0.0.5](https://github.com/namics/gondel/compare/v0.0.4...v0.0.5) (2018-09-19)

**Note:** Version bump only for package @gondel/plugin-media-queries





<a name="0.0.4"></a>
## [0.0.4](https://github.com/namics/gondel/compare/v0.0.1...v0.0.4) (2018-09-17)


### Bug Fixes

* **@gondel/core:** Rethrow caught errors from promises for better dev tool output ([6de6c5f](https://github.com/namics/gondel/commit/6de6c5f))
* **core:** Fix Element is undefined in jest ([ba71f7c](https://github.com/namics/gondel/commit/ba71f7c))


### Features

* Upgrade dependencies ([#13](https://github.com/namics/gondel/issues/13)) ([228c287](https://github.com/namics/gondel/commit/228c287))
* **core:** Start all components on dom ready ([12f4b64](https://github.com/namics/gondel/commit/12f4b64))
* **plugin-media-query:** create media-queries gondel plugin ([#2](https://github.com/namics/gondel/issues/2)) ([5c36e04](https://github.com/namics/gondel/commit/5c36e04))
* **plugin-media-query:** Export the event name as variable name ([4af8458](https://github.com/namics/gondel/commit/4af8458)), closes [#4](https://github.com/namics/gondel/issues/4)


### BREAKING CHANGES

* **plugin-media-query:** The event named viewportChange was removed and is now only accessible using the
exported VIEWPORT_ENTERED constant
