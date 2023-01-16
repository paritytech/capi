import * as $ from "../deps/scale.ts"

export interface Host {
  write<T>(dest: string, contents: T, codec: $.Codec<T>): Promise<void>
  read<T>(src: string, codec: $.Codec<T>): Promise<void>
}

export const fsHost: Host = {
  write(dest, contents, codec) {
    return null!
  },
  read(src, codec) {
    return null!
  },
}

export const memoryHost: Host = {
  write(dest, contents, codec) {
    return null!
  },
  read(src, codec) {
    return null!
  },
}
