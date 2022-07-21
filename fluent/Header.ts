import { rpcCall } from "../effect/atoms/RpcCall.ts";
import { run } from "../effect/run.ts";
import { Block } from "./Block.ts";
import { Chain } from "./Chain.ts";
import { NodeBase } from "./common.ts";

export class Header<C extends Chain = Chain> extends NodeBase<"Header"> {
  constructor(readonly chain: C) {
    super();
  }

  read(block?: Block<C>) {
    return run(rpcCall(this.chain.config as any, "chain_getHeader", block?.hash));
  }

  declare watch: (cb: (message: unknown) => void) => any;
}
