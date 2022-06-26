import { Beacon } from "../Beacon.ts";
import * as M from "../frame_metadata/mod.ts";
import * as U from "../util/mod.ts";

export class Runtime<
  DiscoveryValue,
  M extends U.AnyMethods,
> {
  #chains = new Map<Beacon<DiscoveryValue, M>, ChainContext>();

  register = async (beacon: Beacon<DiscoveryValue, M>): Promise<ChainContext> => {
    const existingChain = this.#chains.get(beacon);
    if (existingChain) {
      return existingChain;
    }
    const chain = new ChainContext(this, beacon);
    this.#chains.set(beacon, chain);
    return chain;
  };
}

export const globalContext = new Runtime();

export interface RuntimeGroup {
  metadata: M.Metadata;
  lookup: M.Lookup;
  deriveCodec: M.DeriveCodec;
}

export class ChainContext {
  users = 1;
  groups: Record<U.HashHexString, RuntimeGroup> = {};

  constructor(
    readonly beacon: Beacon,
  ) {}

  load = async (blockHash?: U.HashHexString): Promise<RuntimeGroup> => {
    let blockHashEnsured: U.HashHexString = blockHash as U.HashHexString;
    if (blockHash === undefined) {
      const currentBlockHashRaw = await this.rpcClient.call("chain_getHead", []);
      if (currentBlockHashRaw.result) {
        blockHashEnsured = currentBlockHashRaw.result;
      } else {
        throw new Error(); // TODO
      }
    }
    const group = this.groups[blockHashEnsured];
    if (group) {
      return group;
    }
    const raw = await this.rpcClient.call("state_getMetadata", [blockHash]);
    if (raw.result) {
      const metadata = M.fromPrefixedHex(raw.result);
      const roup: RuntimeGroup = {
        metadata,
        lookup: new M.Lookup(metadata),
        deriveCodec: M.DeriveCodec(metadata),
      };
      this.groups[blockHashEnsured] = roup;
      return roup;
    }
    throw new Error(); // TODO
  };
}
