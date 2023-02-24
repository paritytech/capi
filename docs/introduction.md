# Introduction

<!-- dinodoc fragment.start docs/_fragments/description -->

Capi is a framework for crafting interactions with Substrate-based chains. It consists of a development server, a functional effect system ([Rune](/rune)) and a fluent API, which facilitates multistep, multichain interactions without compromising either performance or ease of use.

<!-- dinodoc fragment.end -->

The remainder of this page focuses on the impetus for this initiative. If you wish to dive into using Capi, check out [the "Getting Started" guide](/docs/getting_started/first_steps.md).

## Background

Chain resources are intentionally-constrained by economic incentives; this limits an app developer's ability to implement access patterns, which would otherwise benefit the end-user experience. Many such access patterns relate to data aggregation and preprocessing; doing this work on the client-side (in a browser, for example) consumes already-sparse resources. In other circumstances, the developer might move these tasks to less-constrained environments, such as that of a centralized server. Although Substrate developers can use centralized servers as proxies to chains, this introduces points of stoppability. There is currently no obvious solution to avoiding this trade-off.

## The Capi Approach

Capi interactions are defined via Runes, which are a declarative, portable and strongly-typed building block for descriptions of client-chain interactions (including [XCM](https://github.com/paritytech/xcm-format)essaging). **Rune enable potentially-complex interactions to be folded into their most minimal and parallelized form, so that Capi developers need not think about redundancy and timing. This is what enables Capi to be declarative, performant, fluent and incredibly-well-typed. Speaking of typings: Capi even represents errors within the type system (which is not the case for 99.9% of JavaScript APIs).

## Future Considerations

The Capi approach is meant to accommodate new technical possibilities––as they are devised––without requiring effort from developers; Runes _could be_ serialized and shared with other environments (such as RPC nodes), which could assist in their fulfillment (perhaps for tiny micropayments), therein easing the burden on front-end clients. Meanwhile, this portability means we can statically analyze the scope of an interaction, which could be useful for the creation of policies that govern session keys, among other future cases. The list of open doors goes on and on.
