import { S3Bucket, S3BucketConfig } from "../../deps/s3.ts"
import { Cache } from "./base.ts"

export class S3Cache extends Cache {
  bucket

  constructor(config: S3BucketConfig, signal: AbortSignal) {
    super(signal)
    this.bucket = new S3Bucket(config)
  }

  async _getRaw(key: string, init: () => Promise<Uint8Array>) {
    const result = await this.bucket.getObject(key)
    if (result) {
      return new Uint8Array(await new Response(result.body).arrayBuffer())
    }
    const value = await init()
    await this.bucket.putObject(key, value)
    return value
  }

  async _list(prefix: string): Promise<string[]> {
    const result = await this.bucket.listObjects({ prefix })
    return result?.contents?.map((object) => object.key!.slice(prefix.length)) ?? []
  }
}
