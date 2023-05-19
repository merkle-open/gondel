# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.2.8](https://github.com/merkle-open/gondel/compare/v1.2.7...v1.2.8) (2023-05-19)

### Bug Fixes

- bump deps ([7ae645b](https://github.com/merkle-open/gondel/commit/7ae645ba5d64cf5274fe325c13414cb676b9a615))
- bump deps and default node version ([9c1aeec](https://github.com/merkle-open/gondel/commit/9c1aeec8d3fb03765ea74bb11c29d31205e742bb))
- bump dev deps and add new build files ([98f7ed2](https://github.com/merkle-open/gondel/commit/98f7ed284ab15bd4fc7c2f004c520808f61c6559))
- bump typescript ([f5bbca8](https://github.com/merkle-open/gondel/commit/f5bbca8da39875f21d7bfe6dc1c3076a1e607e15))

## [1.2.7](https://github.com/merkle-open/gondel/compare/v1.2.6...v1.2.7) (2021-05-06)

**Note:** Version bump only for package @gondel/plugin-react

## [1.2.6](https://github.com/merkle-open/gondel/compare/v1.2.5...v1.2.6) (2020-11-16)

**Note:** Version bump only for package @gondel/plugin-react

## [1.2.5](https://github.com/merkle-open/gondel/compare/v1.2.4...v1.2.5) (2020-11-16)

**Note:** Version bump only for package @gondel/plugin-react

## [1.2.4](https://github.com/merkle-open/gondel/compare/v1.2.3...v1.2.4) (2020-09-21)

**Note:** Version bump only for package @gondel/plugin-react

## [1.2.3](https://github.com/merkle-open/gondel/compare/v1.2.2...v1.2.3) (2020-03-09)

### Bug Fixes

- **react plugin:** export typescript interface for better ide support ([fa87524](https://github.com/merkle-open/gondel/commit/fa875240eb64d76bdcbb3427d27b10f4323ffc31))

## [1.2.2](https://github.com/merkle-open/gondel/compare/v1.2.1...v1.2.2) (2020-03-09)

### Bug Fixes

- **react plugin:** export typescript interface for better ide support ([2aebda5](https://github.com/merkle-open/gondel/commit/2aebda56160bbd5d831c9ca5137731d1ec2d035b))

## [1.2.1](https://github.com/merkle-open/gondel/compare/v1.2.0...v1.2.1) (2020-03-09)

### Bug Fixes

- **react plugin:** export typescript interface for better ide support ([753259d](https://github.com/merkle-open/gondel/commit/753259d45dbdf99c966bab937156db3a9ffae43d))

# [1.2.0](https://github.com/merkle-open/gondel/compare/v1.1.2...v1.2.0) (2020-02-19)

### Features

- **react plugin:** provide a factory function to connect Gondel and React ([c6ac867](https://github.com/merkle-open/gondel/commit/c6ac867ad9841f09d90dda18a9fbb77fb83f6dce))

## [1.1.2](https://github.com/merkle-open/gondel/compare/v1.1.1...v1.1.2) (2020-01-16)

### Bug Fixes

- **react plugin:** allow to set the wrapper html element ([56e8f16](https://github.com/merkle-open/gondel/commit/56e8f16))

## [1.1.1](https://github.com/merkle-open/gondel/compare/v1.1.0...v1.1.1) (2020-01-16)

### Bug Fixes

- **react plugin:** provide default type for State ([d388473](https://github.com/merkle-open/gondel/commit/d388473))

# [1.1.0](https://github.com/merkle-open/gondel/compare/v1.0.0...v1.1.0) (2020-01-16)

### Features

- **react plugin:** add async linkining support to the gondel react plugin ([b39ca5a](https://github.com/merkle-open/gondel/commit/b39ca5a))

# [1.0.0](https://github.com/merkle-open/gondel/compare/v0.1.0...v1.0.0) (2019-11-28)

### Bug Fixes

- **core:** prevent plugins from being registered twice when being in different js files ([66aedec](https://github.com/merkle-open/gondel/commit/66aedec)), closes [#48](https://github.com/merkle-open/gondel/issues/48)

### BREAKING CHANGES

- **core:** enhances structure of pluginEvents object to track if a plugin (in another js file) has already been initialized

# [0.1.0](https://github.com/merkle-open/gondel/compare/v0.0.8...v0.1.0) (2019-04-08)

**Note:** Version bump only for package @gondel/plugin-react

## [0.0.8](https://github.com/merkle-open/gondel/compare/v0.0.7...v0.0.8) (2018-11-19)

### Features

- **react-plugin:** Allow to skip the render method for pure linking components ([3e1c4d7](https://github.com/merkle-open/gondel/commit/3e1c4d7))

## [0.0.7](https://github.com/merkle-open/gondel/compare/v0.0.6...v0.0.7) (2018-11-05)

### Bug Fixes

- **core:** Prevent errors during the event handling ([a560c64](https://github.com/merkle-open/gondel/commit/a560c64))

<a name="0.0.6"></a>

## [0.0.6](https://github.com/merkle-open/gondel/compare/v0.0.5...v0.0.6) (2018-09-25)

### Features

- **core:** Allow to type \_ctx ([0ee58fe](https://github.com/merkle-open/gondel/commit/0ee58fe))

### BREAKING CHANGES

- **core:** GondelBaseComponent constructor requires a ctx and a componentName argument

<a name="0.0.5"></a>

## [0.0.5](https://github.com/merkle-open/gondel/compare/v0.0.4...v0.0.5) (2018-09-19)

**Note:** Version bump only for package @gondel/plugin-react

<a name="0.0.4"></a>

## [0.0.4](https://github.com/merkle-open/gondel/compare/v0.0.1...v0.0.4) (2018-09-17)

### Bug Fixes

- **@gondel/core:** Rethrow caught errors from promises for better dev tool output ([6de6c5f](https://github.com/merkle-open/gondel/commit/6de6c5f))
- **plugin-react:** Fix a possible invalid type error ([9622d7d](https://github.com/merkle-open/gondel/commit/9622d7d))

### Features

- **plugin-react:** Release the gondel react plugin ([d7c14dd](https://github.com/merkle-open/gondel/commit/d7c14dd))
- Upgrade dependencies ([#13](https://github.com/merkle-open/gondel/issues/13)) ([228c287](https://github.com/merkle-open/gondel/commit/228c287))
