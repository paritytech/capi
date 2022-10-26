import {} from "../..";
import * as msg from "./msg.ts";

/**
 * @param client something
 * @param blockHash
 */
export function state_getMetadata(
  client: Client,
  blockHash?: Hash,
): Promise<msg.Ok<HashHex> | msg.Err> {}
