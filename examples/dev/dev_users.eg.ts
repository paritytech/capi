/**
 * @title Create Dev Users
 * @stability nearing
 * @description When developing against a dev chain, the `createDevUsers` utility
 * provides `Sr25519` instances, which correspond to dev users who are pre-seeded with
 * funds. This simplifies signing extrinsics for submission to the given dev chain.
 */

import { $, $sr25519, createDevUsers } from "capi"

/// Dev users can be initialized with no count. The resulting collection is
/// a record with 26 `Sr25519`s (one for every letter of the alphabet).
const { alexa, billy, carol } = await createDevUsers()

/// If count is specified, the result is an `Sr25519` tuple of the specified length.
const [david, ellie, felix] = await createDevUsers(3)

/// Each of the following elements should be an `Sr25519` instance.
const users = [alexa, billy, carol, david, ellie, felix]
console.log("Users:", users)
$.assert($.array($sr25519), users)
