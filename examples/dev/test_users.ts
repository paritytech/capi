/**
 * @title Create Test Users
 * @stability stable
 *
 * When developing against a test chain, the `createUsers` utility
 * provides `Sr25519` instances, which correspond to test users (pre-seeded with funds).
 * This simplifies signing extrinsics for submission to the given test chain.
 */

import { createUsers } from "polkadot_dev/mod.js"

// Test users can be initialized with no count. The resulting collection is
// a record with 26 `Sr25519`s (one for every letter of the alphabet).
// deno-lint-ignore no-unused-vars
const { alexa, billy, carol } = await createUsers()

// If count is specified, the result is an `Sr25519` tuple of the specified length.
// deno-lint-ignore no-unused-vars
const [david, ellie, felix] = await createUsers(3)
