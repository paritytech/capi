import { unimplemented } from "../../deps/std/testing/asserts.ts";
import * as M from "../../frame_metadata/mod.ts";
import { rpc as knownRpc } from "../../known/mod.ts";
import * as rpc from "../../rpc/mod.ts";
import { Ss58 } from "../../ss58/mod.ts";
import * as U from "../../util/mod.ts";
import * as a from "../atoms/mod.ts";
import * as sys from "../sys/mod.ts";

type Config = knownRpc.Config<
  string,
  | "state_getMetadata"
  | "state_getRuntimeVersion"
  | "chain_getBlockHash"
  | "system_accountNextIndex"
  | "system_chain"
  | "author_unwatchExtrinsic",
  "author_submitAndWatchExtrinsic"
>;

export function sendAndWatchExtrinsic<
  PalletName extends sys.Val<string>,
  MethodName extends sys.Val<string>,
  Args extends Record<string, unknown>,
>(
  config: Config,
  sender: sys.Val<M.MultiAddress>,
  palletName: PalletName,
  methodName: MethodName,
  args: Args,
  sign: M.SignExtrinsic,
  createWatchHandler: U.CreateWatchHandler<
    rpc.NotifMessage<Config, "author_submitAndWatchExtrinsic">
  >,
) {
  const metadata = a.metadata(config);
  const deriveCodec = a.deriveCodec(metadata);
  const $extrinsic = a.$extrinsicEncodeAsync(deriveCodec, metadata, sign);
  const runtimeVersion = a.rpcCall(config, "state_getRuntimeVersion", []);
  const senderSs58 = sys.anon([sender], async (sender) => {
    const ss58 = await Ss58();
    // TODO: other types
    if (sender.type !== "Id") {
      return unimplemented();
    }
    return ss58.encode(0, /* TODO */ U.hex.encode(sender.value)) as U.AccountIdString;
  });
  const accountNextIndex = a.rpcCall(config, "system_accountNextIndex", [senderSs58]);
  const genesisHash = a.rpcCall(config, "chain_getBlockHash", [0]);
  const extrinsicHex = sys.anon([
    $extrinsic,
    sender,
    methodName,
    palletName,
    runtimeVersion,
    accountNextIndex,
    genesisHash,
  ], async (
    $extrinsic,
    sender,
    methodName,
    palletName,
    { result: { specVersion, transactionVersion } },
    { result: nextI },
    { result: genesisHashHex },
  ) => {
    const genesisHash = U.hex.decode(genesisHashHex);
    const extrinsicBytes = await $extrinsic({
      protocolVersion: 4, // TODO: grab this from elsewhere
      palletName,
      methodName,
      args,
      signature: {
        address: sender,
        // TODO: extract this out of the effect & make configurable
        extra: [/* era */ { type: "Immortal" }, /* nonce */ nextI, /* tip */ 0],
        // TODO: enable specificity of checkpoint
        additional: [specVersion, transactionVersion, genesisHash, genesisHash],
      },
    });
    return U.hex.encode(extrinsicBytes) as U.HexString;
  });
  return a.rpcSubscription(
    config,
    "author_submitAndWatchExtrinsic",
    [extrinsicHex],
    createWatchHandler,
    (ok) => {
      return a.rpcCall(config, "author_unwatchExtrinsic", [ok.result]);
    },
  );
}
