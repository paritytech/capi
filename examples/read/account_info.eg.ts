/**
 * @title Read a Map Value
 * @stability nearing
 * @description Read the value (an `AccountInfo`) from the system account map.
 */

import { $accountInfo, polkadotDev } from "@capi/polkadot-dev"
import { $, createDevUsers, Scope } from "capi"

const { alexa } = await createDevUsers()

/// Retrieve Alexa's account info.
const accountInfo = await polkadotDev.System.Account.value(alexa.publicKey).run(new Scope())

/// Ensure that the account info is of the expected shape.
console.log("Account info:", accountInfo)
$.assert($accountInfo, accountInfo)
