/**
 * @title Read a Map Value
 * @stability nearing
 * @description Read the value (an `AccountInfo`) from the system account map.
 */

import { $accountInfo, System } from "@capi/polkadot-dev"
import { $, createDevUsers } from "capi"

const { alexa } = await createDevUsers()

const accountInfo = await System.Account.value(alexa.publicKey).run()

console.log("Account info:", accountInfo)
$.assert($accountInfo, accountInfo)
