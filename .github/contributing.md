# Contributing

We are more than happy to accept external contributions to the project
in the form of feedback, bug reports and even better - pull requests :)
All our CodeSandBox-Samples are [synced-templates](https://codesandbox.io/docs/learn/sandboxes/synced-templates) with our GitHub-repo: they will update automatically, once our repositories main branch got updated.

## How to contribute

### Give feedback on issues

We're always looking for more opinions on discussions in the [issue tracker](https://github.com/merkle-open/gondel/issues).
It's a good opportunity to influence the future direction of gondel.

### Creating Issues

In order for us to help you, please check that you've completed the following steps:

* Make sure you're on the latest version
* Use the search feature to ensure that the issue hasn't been reported before
* Include as much information about the issue as possible, including
any output you've received, what OS and version you're on, etc.
  
[Submit your issue](https://github.com/merkle-open/gondel/issues/new)

### Opening pull requests

* Please check to make sure that there aren't existing pull requests attempting to address the issue mentioned. We also recommend checking for issues related to the issue on the tracker, as a team member may be working on the issue in a branch or fork.
* Non-trivial changes should be discussed in an issue first
* Please check project guidelines from `.editorconfig` & `.prettierrc`
* Develop in a topic branch
* Make sure test-suite passes: `npm test` (This includes linting).
* Push to your fork and submit a pull request to the development branch

Some things that will increase the chance that your pull request is accepted:

* Write tests
* Write a meaningful commit message
* Write a convincing description of your PR and why we should land it

#### Quick Start

* You need [node](../.node-version) of course
* Fork, then clone the repo and then run `npm install` in them
* Start hacking ;-)

You can keep your repo up to date by running `git pull --rebase upstream master`.
