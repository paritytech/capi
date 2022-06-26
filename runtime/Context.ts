import * as M from "../frame_metadata/mod.ts";
import { KnownRpcMethods } from "../known/mod.ts";
import { detectClient, StdBeacon, StdClient } from "../rpc/mod.ts";
import * as U from "../util/mod.ts";

export class GlobalContext {
  chains = new Map<StdBeacon<KnownRpcMethods>, ChainContext>();

  register = async (beacon: StdBeacon<KnownRpcMethods>) => {
    const existingChain = this.chains.get(beacon);
    if (existingChain) {
      return existingChain;
    }
    const rpcClient = await detectClient(beacon);
    if (rpcClient instanceof Error) {
      return rpcClient;
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
    readonly globalContext: GlobalContext,
    readonly beacon: StdBeacon<KnownRpcMethods>,
    readonly rpcClient: StdClient<KnownRpcMethods>,
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
      const group: RuntimeGroup = {
        metadata,
        lookup: new M.Lookup(metadata),
        deriveCodec: M.DeriveCodec(metadata),
      };
      this.groups[blockHashEnsured] = group;
      return group;
    }
    throw new Error(); // TODO
  };

  release = async () => {
    if (this.users === 1) {
      this.globalContext.chains.delete(this.beacon);
      await this.rpcClient.close();
    } else {
      this.users -= 1;
    }
  };
}
