import { unimplemented } from "../deps/std/testing/asserts.ts";
import * as Z from "../deps/zones.ts";
import * as M from "../frame_metadata/mod.ts";
import * as known from "../known/mod.ts";
import * as rpc from "../rpc/mod.ts";
import * as ss58 from "../ss58/mod.ts";
import * as U from "../util/mod.ts";
import { $extrinsic } from "./core/$extrinsic.ts";
import { deriveCodec } from "./core/deriveCodec.ts";
import { Name } from "./core/runtime.ts";
import { Metadata } from "./Metadata.ts";
import { RpcCall } from "./RpcCall.ts";
import { RpcSubscription } from "./RpcSubscription.ts";

export { type Config as SendAndWatchExtrinsicConfig };
type Config = known.rpc.Config<
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
  sender: Z.$<M.MultiAddress>;
  palletName: Z.$<string>;
  methodName: Z.$<string>;
  args: Z.$<Record<string, unknown>>;
  checkpoint?: Z.$<U.HashHexString>;
  mortality?: Z.$<[period: bigint, phase: bigint]>;
  nonce?: Z.$<string>;
  tip?: Z.$<bigint>;
  sign: M.SignExtrinsic;
  createWatchHandler: U.CreateWatchHandler<
    rpc.NotifMessage<Config, "author_submitAndWatchExtrinsic">
  >;
}

export class ExtrinsicSentWatch<Props extends SendAndWatchExtrinsicProps> extends Name {
  root;

  constructor(props: Props) {
    super();
    const metadata_ = new Metadata(props.config);
    const deriveCodec_ = deriveCodec(metadata_);
    const $extrinsic_ = $extrinsic(deriveCodec_, metadata_, props.sign, props.config.addressPrefix);
    const runtimeVersion = new RpcCall(props.config, "state_getRuntimeVersion", []);
    const senderSs58 = Z.atom([props.sender], (sender) => {
      return ((): string => {
        switch (sender.type) {
          case "Id": {
            return ss58.encode(props.config.addressPrefix, sender.value);
          }
          // TODO: other types
          default: {
            unimplemented();
          }
        }
      })() as U.AccountIdString;
    });
    const accountNextIndex = new RpcCall(props.config, "system_accountNextIndex", [senderSs58]);
    const genesisHash = Z.atom(
      [new RpcCall(props.config, "chain_getBlockHash", [0])],
      ({ result }) => {
        return U.hex.decode(result);
      },
    );
    const checkpointHash = props.checkpoint
      ? Z.atom([props.checkpoint], (v) => {
        return U.hex.decode(v);
      })
      : genesisHash;
    const extrinsicHex = Z.atom([
      $extrinsic_,
      props.sender,
      props.methodName,
      props.palletName,
      runtimeVersion,
      accountNextIndex,
      genesisHash,
      props.args,
      checkpointHash,
      props.tip,
      props.mortality,
    ], async (
      $extrinsic,
      sender,
      methodName,
      palletName,
      { result: { specVersion, transactionVersion } },
      { result: nonce },
      genesisHash,
      args,
      checkpoint,
      tip,
      mortality,
    ) => {
      const extrinsicBytes = await $extrinsic.encodeAsync({
        protocolVersion: 4, // TODO: grab this from elsewhere
        palletName,
        methodName,
        args,
        signature: {
          address: sender,
          extra: [
            mortality
              ? {
                type: "Mortal",
                value: mortality,
              }
              : { type: "Immortal" },
            nonce,
            tip || 0,
          ],
          additional: [specVersion, transactionVersion, checkpoint, genesisHash],
        },
      });
      return U.hex.encode(extrinsicBytes) as U.HexString;
    });
    this.root = new RpcSubscription(
      props.config,
      "author_submitAndWatchExtrinsic",
      [extrinsicHex],
      props.createWatchHandler,
      (ok) => {
        return new RpcCall(props.config, "author_unwatchExtrinsic", [ok.result]);
      },
    );
  }
}
