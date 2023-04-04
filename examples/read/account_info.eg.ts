/**
 * @title Read a Map Value
 * @stability nearing
 *
 * Read the value (an `AccountInfo`) from the system account map.
 */

import { createUsers, System, types } from "@capi/polkadot-dev/mod.js"
import { $ } from "capi"

const { alexa } = await createUsers()

const accountInfo = await System.Account.value(alexa.publicKey).run()

console.log("Account info:", accountInfo)
$.assert(types.frame_system.$accountInfo, accountInfo)
