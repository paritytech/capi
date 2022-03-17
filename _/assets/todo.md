# TODO

In addition to the following todos, the codebase is scattered with `TODO` comments. Lot's to do.

## High Priority

- Code generation e2e
- Address, Account & Keypair utils & effects
- Extrinsics
- Typed errors. As many as possible.
- API wrapping existing wallets
- MORE TESTS

## Workflow-related

- CI testing
- CI-produced dependency update PRs ([udd](https://github.com/hayd/deno-udd))
- Format task
- API Reference gen
- Dependency / lock management
- Changelog gen
- Prune unused files / imports
- Validations
  - Scan for secrets / keys
  - Avoiding circular deps
  - License-checking
  - Src headings
  - Prevent bad language

## Before Public Beta

- Don't necessarily gitignore all artifacts in `target`, as these can be referenced by Deno programs, esm.sh, paka, unpkg, etc.
- Profile and slim it down
- Benchmark against `@polkadot-js/api`
- See if any Wasm experts have advice on reducing build size
  > maybe there's wisdom in [this](https://github.com/stusmall/wasm-udf-example/blob/main/adder/src/lib.rs)?
- Opt-in telemetry for the CLI... or not...
- Ensure optimal Devcontainer & Gitpod configs / Docker image building properly
- Configure GitHub presence & CI
- **DOCUMENTATION**

## Backlog

- Version management / capi.lock files / migration helper codegen
- Smart-contract-specific DX, e2e
- Chat Bots
  - Discord
    > https://github.com/discordeno/discordeno
  - Slack
    > https://github.com/khrj/slack-bolt
  - Telegram
    > https://github.com/grammyjs/grammY
  - Matrix
    > https://github.com/turt2live/matrix-bot-sdk
