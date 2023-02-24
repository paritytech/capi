# Introduction

<!-- dinodoc fragment.start docs/_fragments/description -->

Capi is a framework for crafting interactions with Substrate chains. It consists of a development server, wide-ranging Substrate-focused utilities and a fluent API, which facilitates multistep, multichain interactions without compromising either performance or ease of use.

<!-- dinodoc fragment.end -->

The remainder of this page focuses on the impetus for this initiative. If you wish to dive into using Capi, check out [the "Getting Started" guide](/docs/getting_started/Readme.md).

## Background

Chain resources are intentionally-constrained by economic incentives; this limits an app developer's ability to implement access patterns, which would otherwise benefit the end-user experience. Many such access patterns relate to data aggregation and preprocessing; doing this work on the client-side (in a browser, for example) consumes already-sparse resources. In other circumstances, the developer might move these tasks to less-constrained environments, such as that of a centralized server. Although developers can use centralized servers as proxies to chains, these intermediaries are points of stoppability. There is currently no obvious solution to avoiding this trade-off.

## The Capi Approach

Capi interactions are defined via Runes, which are a declarative, portable and strongly-typed building blocks describing client-chain interactions (including [XCM](https://github.com/paritytech/xcm-format)essaging). **Runes enable potentially-complex interactions to be folded into their most minimal and parallelized form, so that Capi developers need not think about redundancy and timing**. This is what enables Capi to be declarative, performant, fluent and incredibly-well-typed. Speaking of typings: Capi even represents errors within the type system (which is not the case for 99.9% of JavaScript APIs).

## Future Considerations

The Capi approach is meant to accommodate new technical possibilities––as they are devised––without requiring effort from developers. **Perhaps we will want to...***

- Serialize and share Runes with other environments (such as RPC nodes), which could assist in their fulfillment for micropayments, therein easing the burden on front-end clients.
- Statically analyze Runes in order to generate policies that govern session keys related accounting for the scope of those interactions.
- Generate clients to be consumed in other programming languages.
- Your feature request (please don't hesitate to [file an issue](https://github.com/paritytech/capi/issues/new))
