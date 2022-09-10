# Philosophy

> The following sections do not cover practical usage of Capi, but rather give background on underlying ideas. By all means **[skip to the next section](Testing.md) if your goal is to dive into building**.

What principles guide the development of Capi?

## Foresight

Capi must adapt to future use cases and technical possibilities.

### Multichain

One of the core goals behind Substrate is to support a multichain future. As we approach this future, there is increasing pressure on JavaScript clients to interact with multiple chains simultaneously. This is quite difficult in practice, as developers must manually instantiate and await connections, optimize disconnection and re-connection, and devise other means of preserving the limited resources of their JavaScript environments.

Capi reduces this friction; developers declare their requirements as [Effects](Effects.md) and allow an executor to determine the most efficient route to fulfillment. The management and optimization of connections, and communication across those connections, is abstracted away from the developer.

### Access Patterns

Chain resources are intentionally-constrained by economic incentives; this limits a developer's ability to implement access patterns, which would otherwise benefit the end-user experience. Many such access patterns relate to data aggregation and preprocessing; doing this work on the client-side (in a browser, for example) consumes already-sparse resources. In other circumstances, the developer might move these tasks to less-constrained environments, such as that of a centralized server. Although Substrate developers can use centralized servers as chain proxies, this introduces points of failure. There is currently no obvious solution to avoiding trade-offs.

Capi is designed to accommodate solutions––as they are devised––without requiring effort from developers. Standard effects can be made portable, such that they can be shared with other environments, which could assist in their fulfillment. We hope to make progress on realizing a [`chainHead_wasmQuery` RPC endpoint](https://github.com/paritytech/json-rpc-interface-spec/issues/4) as a first step towards addressing this principle.

## Offer a Foundation

Capi provides a foundation on top of which higher-level solutions can be built.

### Effect System

The basis of Capi is its effect system, with which developers describe chain interactions. This system is designed to make interactions optimally composable.

### Compatibility

Capi is compatible with modern JavaScript environments; its behavior is consistent across browsers, [Node](https://nodejs.org/en/), [Deno](https://deno.land/) and even raw [V8](https://v8.dev/) (such is the case in [CloudFlare Workers](https://developers.cloudflare.com/workers/learning/how-workers-works#isolates)). Capi fits into the mold of popular build tools, such as [Webpack](https://webpack.js.org/), [Rollup](https://rollupjs.org/guide/en/) and [Vite](https://vitejs.dev/). We aim to ensure that Capi fits into ESLint plugins, VSCode extensions, Vim/Neovim plugins and other tooling experiences where there is benefit to developers.

## Safety

### Testing

All dependencies of an effect are known before its evaluation; this metadata can be used within analysis and testing solutions.

## Application Evolution

Forkless upgrades are a defining feature of Substrate-based chains. Yet, this feature is also a point of failure for dependents of those chains. Following an upgrade, an app may form newly-invalid transactions or attempt to access newly-nonexistent storage. Capi provides a means for developers to prepare for runtime upgrades and seamlessly transition their apps with as little downtime as possible.

---

We've now covered some core considerations behind Capi. Let's move onto [the next section](Testing.md), in which we'll spawn a local development node and use it to test Capi.
