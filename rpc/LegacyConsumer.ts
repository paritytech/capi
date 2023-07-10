import { Consumer } from "./Consumer.ts"
import { SignedBlock, StorageChangeSet, TransactionStatus } from "./known/mod.ts"

export class LegacyConsumer extends Consumer {
  requirements = [
    "author_submitAndWatchExtrinsic",
    "author_unwatchExtrinsic",
    "chain_getBlock",
    "chain_getBlockHash",
    "state_getKeysPaged",
    "state_getMetadata",
    "state_queryStorageAt",
    "system_accountNextIndex",
  ]

  metadata(blockHash?: string) {
    return this.call<string>("state_getMetadata", [blockHash])
  }

  // TODO: latest finalized block number if undefined
  blockHash(blockNumber?: string) {
    return this.call<string>("chain_getBlockHash", [blockNumber])
  }

  block(blockHash?: string) {
    return this.call<SignedBlock>("chain_getBlock", [blockHash])
  }

  keys(key: string, limit: number, start?: string, blockHash?: string) {
    return this.call<string[]>("state_getKeysPaged", [key, limit, start, blockHash])
  }

  async values(keys: string[], blockHash?: string) {
    const message = await this.call<StorageChangeSet>("state_queryStorageAt", [keys, blockHash])
    return message.changes.map(([_key, value]) => value ?? undefined)
  }

  nonce(ss58Address: string) {
    return this.call<number>("system_accountNextIndex", [ss58Address])
  }

  submitExtrinsic(
    extrinsic: string,
    handler: (status: TransactionStatus) => void,
    signal: AbortSignal,
  ) {
    this.subscription(
      "author_submitAndWatchExtrinsic",
      "author_unwatchExtrinsic",
      [extrinsic],
      handler,
      signal,
    )
  }
}
