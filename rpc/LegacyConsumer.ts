import { hex } from "../crypto/mod.ts"
import { Consumer } from "./Consumer.ts"
import { SignedBlock, StorageChangeSet, TransactionStatus } from "./known/mod.ts"

export class LegacyConsumer extends Consumer {
  requirements = [
    "author_submitAndWatchExtrinsic",
    "author_unwatchExtrinsic",
    "chain_getBlock",
    "chain_getBlockHash",
    "state_call",
    "state_getKeysPaged",
    "state_queryStorageAt",
    "system_accountNextIndex",
  ]

  metadata(blockHash?: string) {
    return this.stateCall("Metadata_metadata", new Uint8Array(), blockHash)
  }

  async stateCall(method: string, args: Uint8Array, blockHash?: string) {
    return hex.decode(await this.call("state_call", [method, hex.encodePrefixed(args), blockHash]))
  }

  async blockHash(blockNumber?: number) {
    return await this.call<string>("chain_getBlockHash", [blockNumber])
  }

  block(blockHash?: string) {
    return this.call<SignedBlock>("chain_getBlock", [blockHash])
  }

  async keys(key: Uint8Array, limit: number, start?: Uint8Array, blockHash?: string) {
    return (await this.call<string[]>("state_getKeysPaged", [
      hex.encodePrefixed(key),
      limit,
      start ? hex.encodePrefixed(start) : undefined,
      blockHash,
    ])).map(hex.decode)
  }

  async values(keys: Uint8Array[], blockHash?: string) {
    const message = await this.call<[StorageChangeSet]>("state_queryStorageAt", [
      keys.map(hex.encodePrefixed),
      blockHash,
    ])
    return message[0].changes.map(([_key, value]) => value ? hex.decode(value) : undefined)
  }

  nonce(ss58Address: string) {
    return this.call<number>("system_accountNextIndex", [ss58Address])
  }

  submitExtrinsic(
    extrinsic: Uint8Array,
    handler: (status: TransactionStatus) => void,
    signal: AbortSignal,
  ) {
    this.subscription(
      "author_submitAndWatchExtrinsic",
      "author_unwatchExtrinsic",
      [hex.encodePrefixed(extrinsic)],
      handler,
      signal,
    )
  }
}
