/**
 * @title Fetch Chainspec
 * @stability nearing
 * @description Connecting with Smoldot requires a chainspec, which needs to be
 * initially fetched from a wss server. This chain spec can be saved and used to
 * connect to the chain in the future.
 */

import { chain } from "@capi/polkadot"

// We'll connect to the polkadot wss server to get the chainspec.
const chainSpec = await chain.connection.call("sync_state_genSyncSpec", true).run()

// We'll print out the chainspec here. This can be written into a file for later use.
console.log(JSON.stringify(chainSpec, null, 2))
