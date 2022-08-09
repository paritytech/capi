import {
  sendAndWatchExtrinsic,
  SendAndWatchExtrinsicConfig,
} from "../effect/std/submitAndWatchExtrinsic.ts";
import * as M from "../frame_metadata/mod.ts";
import * as rpc from "../rpc/mod.ts";
import * as U from "../util/mod.ts";
import { Call } from "./Call.ts";
import { NodeBase } from "./common.ts";

export class Signed<C extends Call = Call> extends NodeBase<"Signed"> {
  chain;

  constructor(
    readonly call: C,
    readonly from: M.MultiAddress,
    readonly sign: M.SignExtrinsic,
  ) {
    super();
    this.chain = call.chain;
  }

  sendAndWatch(
    createWatchHandler: U.CreateWatchHandler<
      rpc.NotifMessage<SendAndWatchExtrinsicConfig, "author_submitAndWatchExtrinsic">
    >,
  ) {
    return sendAndWatchExtrinsic({
      config: this.chain.config as any,
      palletName: this.call.extrinsic.pallet.name,
      methodName: this.call.extrinsic.name,
      args: this.call.args,
      sender: this.from,
      sign: this.sign,
      createWatchHandler,
    });
  }
}
