import { S3Bucket, S3BucketConfig } from "../../deps/s3.ts"
import { CacheBase } from "./base.ts"

export class S3Cache extends CacheBase {
  bucket

  constructor(readonly prefix: string, config: S3BucketConfig, signal: AbortSignal) {
    super(signal)
    this.bucket = new S3Bucket(config)
  }

  async _getRaw(key: string, init: () => Promise<Uint8Array>) {
    key = this.prefix + key
    const result = await this.bucket.getObject(key)
    if (result) {
      return new Uint8Array(await new Response(result.body).arrayBuffer())
    }
    const value = await init()
    await this.bucket.putObject(key, value)
    return value
  }

  async _has(key: string): Promise<boolean> {
    return !!(await this.bucket.headObject(key))
  }
}
