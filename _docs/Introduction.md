# Introduction

## Overview

At a birds-eye view, **there are two distinct versions of the Capi developer experience**:

- [A "dynamic" DX](./_docs/dynamic_dx.md) for developers who do not have ahead-of-time knowledge of which chain(s) they are targeting. Their programs must reflect on chain capabilities and derive transcoders at runtime.
- [A statically generated DX](./_/assets/static_dx.md) for developers who do know which chain(s) they are targeting. These developers use the Capi CLI to generate efficient, type-safe bindings to chain resources.

Both of these DXs are powered by [an underlying functional effect system](./_/assets/effects.md), inspired by [Zio](https://zio.dev/) and [EffectTS](https://github.com/effect-ts). These systems abstract over computation (in our case network interactions) such that it can be reduced and cooperatively scheduled (among other optimizations). Effects also offer type-safe error handling, dependency injection and a pleasant, functional-feeling DX.

TODO: introduction
