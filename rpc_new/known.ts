import { call } from "./narrow.ts";

export namespace state {
  /** Some description */
  export function getMetadata(blockHash?: string) {
    return call<string>("state_getMetadata", blockHash);
  }
}
