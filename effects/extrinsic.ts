import { unimplemented } from "../deps/std/testing/asserts.ts";
import * as Z from "../deps/zones.ts";
import * as M from "../frame_metadata/mod.ts";
import * as author from "../known/rpc/author.ts";
import { Config } from "../mod.ts";
import { NotifMessage } from "../rpc/mod.ts";
import * as ss58 from "../ss58/mod.ts";
import * as U from "../util/mod.ts";
import { const as const_ } from "./const.ts";
import { $extrinsic } from "./core/$extrinsic.ts";
import { deriveCodec } from "./core/deriveCodec.ts";
import { hexDecode } from "./core/hex.ts";
import { metadata } from "./metadata.ts";
import { rpcCall } from "./rpcCall.ts";
import { rpcSubscription } from "./rpcSubscription.ts";

export interface ExtrinsicProps {
  sender: M.MultiAddress;
  palletName: string;
  methodName: string;
  args: Record<string, unknown>;
  checkpoint?: U.HexHash;
  mortality?: [period: bigint, phase: bigint];
  nonce?: string;
  tip?: bigint;
}

export class Extrinsic<Props extends Z.Rec$<ExtrinsicProps>> {
  constructor(
    readonly config: Config,
    readonly props: Props,
  ) {}

  signed<Sign extends Z.$<M.SignExtrinsic>>(sign: Sign): SignedExtrinsic<Props, Sign> {
    return new SignedExtrinsic(this.config, this.props, sign);
  }
}

export class SignedExtrinsic<
  Props extends Z.Rec$<ExtrinsicProps>,
  Sign extends Z.$<M.SignExtrinsic>,
> {
  extrinsic;

  constructor(
    readonly config: Config,
    readonly props_: Props,
    readonly sign: Sign,
  ) {
    const props = props_ as Z.Rec$Access<Props>;
    const metadata_ = metadata(config);
    const deriveCodec_ = deriveCodec(metadata_);
    const addrPrefix = const_(config, "System", "SS58Prefix").access("value").as<number>();
    const $extrinsic_ = $extrinsic(deriveCodec_, metadata_, this.sign, addrPrefix);
    const versions = const_(config, "System", "Version").access("value");
    const specVersion = versions.access("spec_version").as<number>();
    const transactionVersion = versions.access("transaction_version").as<number>();
    const senderSs58 = Z.call(
      Z.ls(addrPrefix, props.sender),
      function senderSs58([addrPrefix, sender]) {
        return ((): string => {
          switch (sender.type) {
            case "Id": {
              return ss58.encode(addrPrefix, sender.value);
            }
            // TODO: other types
            default: {
              unimplemented();
            }
          }
        })();
      },
    );
    const nonce = rpcCall(config, "system_accountNextIndex", [senderSs58]).access("result");
    const genesisHash = hexDecode(rpcCall(config, "chain_getBlockHash", [0]).access("result"));
    const checkpointHash = props.checkpoint
      ? Z.call(props.checkpoint, function checkpointOrUndef(v) {
        return v ? U.hex.decode(v) : v;
      })
      : genesisHash;
    this.extrinsic = Z.call(
      Z.ls(
        $extrinsic_,
        props.sender,
        props.methodName,
        props.palletName,
        specVersion,
        transactionVersion,
        nonce,
        genesisHash,
        props.args,
        checkpointHash,
        props.tip,
        props.mortality,
      ),
      async function formExtrinsicHex([
        $extrinsic,
        sender,
        methodName,
        palletName,
        specVersion,
        transactionVersion,
        nonce,
        genesisHash,
        args,
        checkpoint,
        tip,
        mortality,
      ]) {
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
        return U.hex.encode(extrinsicBytes);
      },
    );
  }

  watch<
    WatchHandler extends U.CreateWatchHandler<NotifMessage<author.TransactionStatus>>,
  >(watchHandler: WatchHandler) {
    return signedExtrinsicWatch(this.config, this.extrinsic, watchHandler);
  }

  get sent() {
    return signedExtrinsicSent(this.config, this.extrinsic);
  }
}

// TODO: is this really required? Why not use the RPC call effect directly?
export function signedExtrinsicWatch<
  SignedExtrinsic extends Z.$<U.Hex>,
  WatchHandler extends U.CreateWatchHandler<NotifMessage<author.TransactionStatus>>,
>(
  config: Config,
  signedExtrinsic: SignedExtrinsic,
  watchHandler: WatchHandler,
) {
  return rpcSubscription(
    config,
    "author_submitAndWatchExtrinsic",
    [signedExtrinsic],
    watchHandler,
    (ok) => rpcCall(config, "author_unwatchExtrinsic", [ok.result]),
  );
}

export function signedExtrinsicSent<SignedExtrinsic extends Z.$<U.Hex>>(
  config: Config,
  signedExtrinsic: SignedExtrinsic,
) {
  return rpcCall(config, "author_submitExtrinsic", [signedExtrinsic]);
}
