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

export interface SendAndWatchExtrinsicProps {
  config: Config;
  sender: sys.Val<M.MultiAddress>;
  palletName: sys.Val<string>;
  methodName: sys.Val<string>;
  args: sys.Val<Record<string, unknown>>;
  checkpoint?: sys.Val<U.HashHexString>;
  era?: sys.Val<U.HashHexString>;
  nonce?: sys.Val<string>;
  tip?: sys.Val<U.HexString>;
  extras?: sys.Val<unknown[]>[];
  sign: M.SignExtrinsic;
  createWatchHandler: U.CreateWatchHandler<
    rpc.NotifMessage<Config, "author_submitAndWatchExtrinsic">
  >;
}

export function sendAndWatchExtrinsic<Props extends SendAndWatchExtrinsicProps>(props: Props) {
  const metadata = a.metadata(props.config);
  const deriveCodec = a.deriveCodec(metadata);
  const $extrinsic = a.$extrinsicEncodeAsync(deriveCodec, metadata, props.sign);
  const runtimeVersion = a.rpcCall(props.config, "state_getRuntimeVersion", []);
  const senderSs58 = sys.anon([props.sender], (sender) => {
    return (async (): Promise<string> => {
      switch (sender.type) {
        case "Id": {
          return (await Ss58()).encode(props.config.addressPrefix, U.hex.encode(sender.value));
        }
        // TODO: other types
        default: {
          unimplemented();
        }
      }
    })() as Promise<U.AccountIdString>;
  });
  const accountNextIndex = a.rpcCall(props.config, "system_accountNextIndex", [senderSs58]);
  const genesisHash = a.rpcCall(props.config, "chain_getBlockHash", [0]);
  const extrinsicHex = sys.anon([
    $extrinsic,
    props.sender,
    props.methodName,
    props.palletName,
    runtimeVersion,
    accountNextIndex,
    genesisHash,
    props.args,
  ], async (
    $extrinsic,
    sender,
    methodName,
    palletName,
    { result: { specVersion, transactionVersion } },
    { result: nextI },
    { result: genesisHashHex },
    args,
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
    props.config,
    "author_submitAndWatchExtrinsic",
    [extrinsicHex],
    props.createWatchHandler,
    (ok) => {
      return a.rpcCall(props.config, "author_unwatchExtrinsic", [ok.result]);
    },
  );
}
