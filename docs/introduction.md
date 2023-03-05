# Introduction

<!-- dinodoc fragment.start docs/_fragments/description -->

Capi is a framework for crafting interactions with Substrate chains. It consists of a development server and fluent API, which facilitates multistep, multichain interactions without compromising either performance or ease of use.

<!-- dinodoc fragment.end -->

The remainder of this page focuses on the impetus for this initiative. If you wish to dive into usage docs, check out [the "Getting Started" guide](/docs/getting_started/Readme.md).

## Background

Chain resources are intentionally-constrained by economic incentives; this informs the design of on-chain programs and in turn limits an app developer's ability to implement access patterns, which would otherwise benefit the end-user experience. Many such access patterns perform data aggregation and preprocessing; doing this work on the client-side (in a browser, for example) consumes already-sparse resources. In other circumstances, app developers might move these tasks to less-constrained environments, such as that of a centralized server. Although developers can use centralized servers as proxies to chains, these intermediaries are points of stoppability. There is currently no obvious solution to avoiding this trade-off.

## The Capi Approach

Capi interactions are defined via Runes, which are declarative, portable and strongly-typed building blocks for describing client-chain interactions (including [XCM](https://github.com/paritytech/xcm-format)essaging). **Runes enable potentially-complex interactions to be folded into their most minimal and parallelized form, so that Capi developers need not think about redundancy and timing**.

## Future Considerations

The Capi approach is meant to accommodate new technical possibilities––as they are devised––without requiring effort from developers. **Perhaps we will want to...**

- Serialize and share Runes with other environments (such as RPC nodes), which could assist in their fulfillment in exchange for micropayments.
- Statically analyze Runes in order to generate minimally-scoped policies that govern session keys.
- Generate clients to be consumed in other programming languages.
- Your feature request (please don't hesitate to [file an issue](https://github.com/paritytech/capi/issues/new))
