# Contributing

When contributing to this repository, please check our open issues and whether there is already an issue related to your idea. Please first discuss the change you wish to make in a GitHub issue and wait for a reply from the maintainers of this repository before making a change.

We have a [code of conduct](CODE_OF_CONDUCT.md); please follow it in all your interactions relating to the project.

## Environment setup

### Container environment setup

Develop in the cloud with [![Gitpod Open](https://img.shields.io/badge/Gitpod-Open-blue?logo=gitpod)](https://gitpod.io/#https://github.com/paritytech/capi)

Develop locally using the [VSCode Remote Container](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension and [Docker](https://docs.docker.com/get-docker/). [![Open in Remote - Containers](https://img.shields.io/badge/Remote_--_Container-Open-blue?logo=visualstudiocode)](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/paritytech/capi)

### Local environment setup

To develop on your machine, install the following (and please submit issues if errors crop up)

- [Deno](https://deno.land/manual@v1.19.3/getting_started/installation)
- [Docker](https://docs.docker.com/get-docker/)
- [NodeJS](https://nodejs.org/) (only necessary if you're going to run [the dnt task](./_/tasks/dnt.ts))
- [dprint](https://dprint.dev/)

## Rules

There are a few basic ground-rules for contributors:

1. **All modifications** must be made in a **pull-request** to solicit feedback from other contributors
2. Contributors should attempt to adhere to the prevailing [code-style](#code-style)

## Pull requests

**For a pull request to be merged it must at least:**

:white_check_mark: &nbsp; Pass CI

:white_check_mark: &nbsp; Have one approving review

:white_check_mark: &nbsp; Have the PR title follow [conventional commit](https://www.conventionalcommits.org/)

**Ideally, a good pull request should:**

:clock3: &nbsp; Take less than 15 minutes to review

:open_book: &nbsp; Have a meaningful description (describes the problem being solved)

:one: &nbsp; Introduce one feature or solve one bug at a time, for which an open issue already exists. In case of a project wide refactoring, a larger PR is to be expected, but the reviewer should be more carefully guided through it

:jigsaw: &nbsp; Issues that seem too big for a PR that can be reviewed in 15 minutes or PRs that need to touch other issues should be discussed and probably split differently before starting any development

:dart: &nbsp; Handle renaming, moving files, linting and formatting separately (not alongside features or bug fixes)

:test_tube: &nbsp; Add tests for new functionality

**Draft pull requests for early feedback are welcome and do not need to adhere to any guidelines.**

When reviewing a pull request, the end-goal is to suggest useful changes to the author. Reviews should finish with approval unless there are issues that would result in:

:x: &nbsp; Buggy behavior

:x: &nbsp; Undue maintenance burden

:x: &nbsp; Measurable performance issues

:x: &nbsp; Feature reduction (i.e. it removes some aspect of functionality that a significant minority of users rely on)

:x: &nbsp; Uselessness (i.e. it does not strictly add a feature or fix a known issue)

:x: &nbsp; Disabling a compiler feature to introduce code that wouldn't compile

## Code style

We use the following tools to enforce linting rules, formatting and spell checking

- [`deno lint`](https://deno.land/manual/tools/linter)
- [`dprint`](https://dprint.dev/)
- [`cspell`](https://cspell.org/)

We encourage adding the [recommended](.vscode/extensions.json) (or similar) extensions to your IDE.

To run a project wide check you can use:

```bash
deno lint
dprint fmt # or dprint check
cspell "**/*"
```

## Releases

Declaring formal releases remains the prerogative of the project maintainer(s).

## License

By contributing to project, you agree that your contributions will be licensed under its [Apache license](LICENSE).

## Changes to this arrangement

This is an experiment and feedback is welcome! This document may also be subject to pull-requests or changes by contributors where you believe you have something valuable to add or change.

## Heritage

These contributing guidelines are modified from

- the "Substrate Project" guidelines https://github.com/paritytech/substrate/blob/master/docs/CONTRIBUTING.adoc
- the "Substrate Contracts UI" guidelines https://github.com/paritytech/contracts-ui/blob/master/CONTRIBUTING.md
