import { unimplemented } from "../_deps/asserts.ts";
import * as core from "../bindings/mod.ts";
import * as M from "../frame_metadata/mod.ts";
import { Hashers } from "../hashers/mod.ts";
import * as rpc from "../rpc/mod.ts";
import * as U from "../util/mod.ts";
import { globalContext } from "./Context.ts";

export type WatchTarget = core.Entry | core.KeyPage | core.Metadata | core.Header | core.Block;

export async function watch<Target extends WatchTarget>(
  target: Target,
  listener: (notification: rpc.NotifMessage<U.AnyMethods>) => void,
): Promise<(() => void) | Error> {
  const chain = await globalContext.register(target.chain.config as any);
  if (chain instanceof Error) {
    return chain;
  }
  const group = await chain.load();
  if (target instanceof core.Entry) {
    const pallet = M.getPallet(group.metadata, target.pallet.name);
    if (pallet instanceof Error) {
      return pallet;
    }
    const storageEntry = M.getEntry(pallet, target.name);
    if (storageEntry instanceof Error) {
      return storageEntry;
    }
    const $key = M.$storageKey({
      deriveCodec: group.deriveCodec,
      hashers: await Hashers(),
      pallet,
      storageEntry,
    });
    const key = $key.encode(target.keys.length === 1 ? target.keys[0]! : target.keys);
    const keyEncoded = U.hex.encode(key) as U.HexString;
    const $value = group.deriveCodec(storageEntry.value);
    const outerListener = (message: rpc.NotifMessage<U.AnyMethods>) => {
      const { result } = message.params;
      const changes = (result as any).changes;
      const changesDecoded = changes.map(([key, value]: [any, any]) => {
        return [
          $key.decode(U.hex.decode(key.substring(2))),
          $value.decode(U.hex.decode(value.substring(2))),
        ];
      });
      listener(changesDecoded);
    };
    const raw = await chain.rpcClient.subscribe(
      "state_subscribeStorage",
      [[keyEncoded]],
      outerListener,
    );
    if (typeof raw === "function") {
      return async () => {
        raw();
        await chain.release();
      };
    }
    return new Error();
  } else {
    unimplemented();
  }
}
