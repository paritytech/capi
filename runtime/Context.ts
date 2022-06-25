import { Beacon } from "../Beacon.ts";
import * as M from "../frame_metadata/mod.ts";
import { KnownRpcMethods } from "../known/mod.ts";
import * as rpc from "../rpc/mod.ts";
import * as U from "../util/mod.ts";

export class GlobalContext {
  chains = new Map<Beacon, ChainContext>();

  register = async (beacon: Beacon<string, KnownRpcMethods>): Promise<ChainContext> => {
    const existingChain = this.chains.get(beacon);
    if (existingChain) {
      existingChain.users += 1;
      return existingChain;
    }
    const rpcClient = await rpc.client(beacon) as any; // TODO
    if (rpcClient instanceof Error) {
      // TODO
      throw rpcClient;
    }
    const chain = new ChainContext(this, beacon, rpcClient);
    this.chains.set(beacon, chain);
    return chain;
  };
}

export const globalContext = new GlobalContext();

export interface RuntimeGroup {
  metadata: M.Metadata;
  lookup: M.Lookup;
  deriveCodec: M.DeriveCodec;
}

export class ChainContext {
  users = 1;
  groups: Record<U.HashHexString, RuntimeGroup> = {};

  constructor(
    readonly global: GlobalContext,
    readonly beacon: Beacon,
    readonly rpcClient: rpc.Client<KnownRpcMethods, any, any, any, any>, // TODO
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

  release = async () => {
    if (this.users === 1) {
      await this.rpcClient.close();
      this.global.chains.delete(this.beacon);
    }
    this.users -= 1;
  };
}
