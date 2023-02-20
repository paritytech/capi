# Introduction

<!-- dinodoc fragment.start docs/_fragments/description -->

Capi is a declarative, TypeScript-first toolkit for crafting interactions with Substrate-based chains. It consists of [FRAME](https://docs.substrate.io/reference/glossary/#frame) utilities, a functional effect system ([Rune](/rune)) and a fluent API, which facilitates multistep, multichain interactions without compromising either performance or ease of use.

<!-- dinodoc fragment.end -->

## Background

Chain resources are intentionally-constrained by economic incentives; this limits an app developer's ability to implement access patterns, which would otherwise benefit the end-user experience. Many such access patterns relate to data aggregation and preprocessing; doing this work on the client-side (in a browser, for example) consumes already-sparse resources. In other circumstances, the developer might move these tasks to less-constrained environments, such as that of a centralized server. Although Substrate developers can use centralized servers as chain proxies, this introduces points of failure. There is currently no obvious solution to avoiding trade-offs.

Capi interactions are defined via ["Rune"](/docs/rune%3F/Readme.md), a declarative, portable and strongly-typed format. **The Rune format enables potentially-complex interactions to be reduced to their most minimal and parallelized form. Rune APIs are declarative, fluent and incredibly-well-typed––in fact, even errors are accounted for at the type-level (which is not the case for 99.9% of JavaScript APIs).

This approach is also meant to accommodate new technical possibilities––as they are devised––without requiring effort from developers; Runes _could be_ serialized and shared with other environments (such as RPC nodes), which could assist in their fulfillment, therein easing the burden on front-end clients.

## Key Concepts

### Pattern Libraries

### Lazy and Declarative
