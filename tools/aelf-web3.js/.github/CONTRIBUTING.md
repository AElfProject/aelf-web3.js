# AElf-sdk.js Contributing Guide

## Requirements

Before you starting, there are some requirement you need to satisfied:

1. Well experience in Node.js, Javascript, cryptography and block chain.
2. Follow our rules and code style.

## Pull Request Guidelines

- The `master` branch is just a snapshot of the latest stable release. All development should be done in dedicated branches. **Do not submit PRs against the `master` branch.**

- It's OK to have multiple small commits as you work on the PR - GitHub will automatically squash it before merging.

- Reduce unnecessary commits, use `git rebase` to merge the commits which have the same purpose

- Make sure all test cases passes.

- If adding a new feature:
  - Add accompanying test case.
  - Provide a convincing reason to add this feature. Ideally, you should open a suggestion issue first and have it approved before working on it.

## Development Setup

### Installation

You will need [Node.js](http://nodejs.org) **version 8+** and [yarn](https://yarnpkg.com/en/docs/install).

After cloning the repo, run:

``` bash
$ yarn # install the dependencies of the project
```

### Developing folder

Usually, you just need to work in `src` folder, **DO NOT** commit any files in `dist`, the release action can only be processed by AElf team.

### Commonly used NPM scripts

Check the field `scripts` of the `package.json` file.

```bash
# run jest test in browser environment in watch mode
$ npm run test:browser:watch

# run jest test in node environment in watch mode
$ npm run test:node:watch

# build all dist files
$ npm run build
```

### Project Structure

- **`build`** Rollup config files and minify script.

  - `webpack.common.js` Common config for webpack.
  
  - `webpack.browser.js` Webpack config file for building umd file.
  
  - `webpack.node.js` Webpack config file for building cjs files.
  
  - `utils.js` Common configs for both node and browser.
  
- **`dist`** Contains all built files. **Note** this directory is only updated when a release happens.

- **`docs`** Some documents which describe the usage of this sdk

- **`examples`** Some simple examples

- **`proto`** Some proto files used by AElf block chain, **Note** this directory is only updated by AElf team

- **`scripts`** Contains build-related scripts, compile files and configuration files
  
  - `compile-proto.js` Compile proto files in `proto` folder into `.json` files and save in `proto` folder 
  
  - `verify-commit-msg.js` Verify commit message in git hook pre-commit, the rules is described in [./COMMIT_CONVENTION.md](./COMMIT_CONVENTION.md)

- **`src`** Contains the source code, the codebase in written in ESNext and style-lint by eslint

- **`test`** Contains all tests, include e2e tests and unit tests. Our test cases is not enough for a high coverage rate, we extremely need your contributes.

### Committing Changes

Commit messages should follow the [commit message convention](./COMMIT_CONVENTION.md) so that changelogs can be automatically generated. Commit messages will be automatically validated upon commit. If you are not familiar with the commit message convention, you can use `npm run commit` instead of `git commit`, which provides an interactive CLI for generating proper commit messages.

Your'd better use npm script to commit:

```bash
$ npm run commit
```

and follow the guides shown in terminal.

### Notification

1. We use `eslint` to lint codes, follow the rules described in `.eslintrc`.

2. We use git hook to verify commit message and codes you are committing, follow the committing rules described in [./COMMIT_CONVENTION.md](./COMMIT_CONVENTION.md).

3. We use `Jest` to process unit test and e2e test, if you modify anything, make sure you can pass all test cases or add new test cases for new functions.
