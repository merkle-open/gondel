# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.2.9](https://github.com/merkle-open/gondel/compare/v1.2.8...v1.2.9) (2025-10-08)

### Bug Fixes

- update dependencies ([782ec9e](https://github.com/merkle-open/gondel/commit/782ec9e740dd4c6d471ec13b4b8ace458e44bb73))
- update rollup ([aaa1713](https://github.com/merkle-open/gondel/commit/aaa171353c96ea45a7e1456bc244e5b6ca43184d))
- update typescript ([d6da397](https://github.com/merkle-open/gondel/commit/d6da397295f7b5efc3222f0d74e60d0111813977))

## [1.2.8](https://github.com/merkle-open/gondel/compare/v1.2.7...v1.2.8) (2023-05-19)

### Bug Fixes

- bump deps ([7ae645b](https://github.com/merkle-open/gondel/commit/7ae645ba5d64cf5274fe325c13414cb676b9a615))
- bump deps and default node version ([b06c2d0](https://github.com/merkle-open/gondel/commit/b06c2d0af36b69d0c12fb2263019f08f86b795fa))
- bump deps and default node version ([9c1aeec](https://github.com/merkle-open/gondel/commit/9c1aeec8d3fb03765ea74bb11c29d31205e742bb))
- bump dev deps and add new build files ([98f7ed2](https://github.com/merkle-open/gondel/commit/98f7ed284ab15bd4fc7c2f004c520808f61c6559))
- bump typescript ([f5bbca8](https://github.com/merkle-open/gondel/commit/f5bbca8da39875f21d7bfe6dc1c3076a1e607e15))

## [1.2.7](https://github.com/merkle-open/gondel/compare/v1.2.6...v1.2.7) (2021-05-06)

**Note:** Version bump only for package @gondel/plugin-media-queries

## [1.2.6](https://github.com/merkle-open/gondel/compare/v1.2.5...v1.2.6) (2020-11-16)

**Note:** Version bump only for package @gondel/plugin-media-queries

## [1.2.5](https://github.com/merkle-open/gondel/compare/v1.2.4...v1.2.5) (2020-11-16)

**Note:** Version bump only for package @gondel/plugin-media-queries

## [1.2.4](https://github.com/merkle-open/gondel/compare/v1.2.3...v1.2.4) (2020-09-21)

**Note:** Version bump only for package @gondel/plugin-media-queries

# [1.2.0](https://github.com/merkle-open/gondel/compare/v1.1.2...v1.2.0) (2020-02-19)

**Note:** Version bump only for package @gondel/plugin-media-queries

# [1.1.0](https://github.com/merkle-open/gondel/compare/v1.0.0...v1.1.0) (2020-01-16)

**Note:** Version bump only for package @gondel/plugin-media-queries

# [1.0.0](https://github.com/merkle-open/gondel/compare/v0.1.0...v1.0.0) (2019-11-28)

### Bug Fixes

- **core:** prevent plugins from being registered twice when being in different js files ([66aedec](https://github.com/merkle-open/gondel/commit/66aedec)), closes [#48](https://github.com/merkle-open/gondel/issues/48)

### BREAKING CHANGES

- **core:** enhances structure of pluginEvents object to track if a plugin (in another js file) has already been initialized

# [0.1.0](https://github.com/merkle-open/gondel/compare/v0.0.8...v0.1.0) (2019-04-08)

**Note:** Version bump only for package @gondel/plugin-media-queries

## [0.0.8](https://github.com/merkle-open/gondel/compare/v0.0.7...v0.0.8) (2018-11-19)

**Note:** Version bump only for package @gondel/plugin-media-queries

## [0.0.7](https://github.com/merkle-open/gondel/compare/v0.0.6...v0.0.7) (2018-11-05)

### Bug Fixes

- **core:** Overwrite currentTarget using a getter ([41a859f](https://github.com/merkle-open/gondel/commit/41a859f)), closes [#11](https://github.com/merkle-open/gondel/issues/11)
- **core:** Prevent errors during the event handling ([a560c64](https://github.com/merkle-open/gondel/commit/a560c64))

<a name="0.0.6"></a>

## [0.0.6](https://github.com/merkle-open/gondel/compare/v0.0.5...v0.0.6) (2018-09-25)

**Note:** Version bump only for package @gondel/plugin-media-queries

<a name="0.0.5"></a>

## [0.0.5](https://github.com/merkle-open/gondel/compare/v0.0.4...v0.0.5) (2018-09-19)

**Note:** Version bump only for package @gondel/plugin-media-queries

<a name="0.0.4"></a>

## [0.0.4](https://github.com/merkle-open/gondel/compare/v0.0.1...v0.0.4) (2018-09-17)

### Bug Fixes

- **@gondel/core:** Rethrow caught errors from promises for better dev tool output ([6de6c5f](https://github.com/merkle-open/gondel/commit/6de6c5f))
- **core:** Fix Element is undefined in jest ([ba71f7c](https://github.com/merkle-open/gondel/commit/ba71f7c))

### Features

- Upgrade dependencies ([#13](https://github.com/merkle-open/gondel/issues/13)) ([228c287](https://github.com/merkle-open/gondel/commit/228c287))
- **core:** Start all components on dom ready ([12f4b64](https://github.com/merkle-open/gondel/commit/12f4b64))
- **plugin-media-query:** create media-queries gondel plugin ([#2](https://github.com/merkle-open/gondel/issues/2)) ([5c36e04](https://github.com/merkle-open/gondel/commit/5c36e04))
- **plugin-media-query:** Export the event name as variable name ([4af8458](https://github.com/merkle-open/gondel/commit/4af8458)), closes [#4](https://github.com/merkle-open/gondel/issues/4)

### BREAKING CHANGES

- **plugin-media-query:** The event named viewportChange was removed and is now only accessible using the
  exported VIEWPORT_ENTERED constant
