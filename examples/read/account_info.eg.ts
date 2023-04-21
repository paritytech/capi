/**
 * @title Read a Map Value
 * @stability nearing
 * @description Read the value (an `AccountInfo`) from the system account map.
 */

import { $accountInfo, PolkadotDev } from "@capi/polkadot-dev"
import { $, createDevUsers } from "capi"

const { alexa } = await createDevUsers()

/// Retrieve Alexa's account info.
const accountInfo = await PolkadotDev.System.Account.value(alexa.publicKey).run()

/// Ensure that the account info is of the expected shape.
console.log("Account info:", accountInfo)
$.assert($accountInfo, accountInfo)
