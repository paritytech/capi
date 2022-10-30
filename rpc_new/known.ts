import { call } from "./narrow.ts";

export namespace state {
  /** Some description */
  export function getMetadata(blockHash?: string) {
    return call("state_getMetadata", blockHash);
  }
}
