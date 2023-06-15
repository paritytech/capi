/**
 * @title Fetch Chainspec
 * @stability nearing
 * @description Connecting with Smoldot requires a chainspec, which needs to be
 * initially fetched from a wss server. This chain spec can be saved and used to
 * connect to the chain in the future.
 */

import { polkadot } from "@capi/polkadot"
import { Scope } from "capi"

/// We'll connect to the polkadot wss server to get the chainspec.
const chainSpec = await polkadot.connection.call("sync_state_genSyncSpec", true).run(new Scope())

/// We'll print out the chainspec here. This can be written into a file for later use.
console.log(chainSpec)

/// Let's export it for use by the `smoldot.eg.ts` example.
export const relayChainSpec = JSON.stringify(chainSpec, null, 2)
