import * as $ from "../deps/scale.ts"

export interface Host {
  abortController: AbortController
  write<T>(dest: string, contents: T, codec: $.Codec<T>): Promise<void>
  read<T>(src: string, codec: $.Codec<T>): Promise<void>
}
