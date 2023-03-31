/**
 * @title Read A Map Value
 * @stability nearing
 *
 * Read the value (an `AccountInfo`) from the system account map.
 */

import { $ } from "capi"
import { createUsers, System, types } from "polkadot_dev/mod.js"

const { alexa } = await createUsers()

const result = await System.Account.value(alexa.publicKey).run()

$.assert(types.frame_system.$accountInfo, result)
