import { hex } from "../crypto/mod.ts"
import { Consumer } from "./Consumer.ts"
import { ExtrinsicStatus } from "./ExtrinsicStatus.ts"
import { SignedBlock, StorageChangeSet, TransactionStatus } from "./known/mod.ts"

export class LegacyConsumer extends Consumer {
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
    handler: (status: ExtrinsicStatus) => void,
    signal: AbortSignal,
  ) {
    this.subscription<TransactionStatus>(
      "author_submitAndWatchExtrinsic",
      "author_unwatchExtrinsic",
      [hex.encodePrefixed(extrinsic)],
      (event) => {
        handler(((): ExtrinsicStatus => {
          if (typeof event === "string") {
            switch (event) {
              case "ready":
                return { type: "validated" }
              case "invalid":
                return { type: "invalidated" }
              case "dropped":
                return { type: "dropped" }
              case "future":
                throw new Error("TODO")
            }
          } else {
            if (event.broadcast) {
              return {
                type: "broadcasted",
                numPeers: event.broadcast.length,
              }
            } else if (event.inBlock) {
              return {
                type: "included",
                block: { hash: event.inBlock },
              }
            } else if (event.finalized) {
              return {
                type: "finalized",
                block: { hash: event.finalized },
              }
            } else {
              return {
                type: "errored",
                message: JSON.stringify(event),
              }
            }
          }
        })())
      },
      signal,
    )
  }
}
