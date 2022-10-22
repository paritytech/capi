import { unimplemented } from "../deps/std/testing/asserts.ts";
import * as Z from "../deps/zones.ts";
import * as M from "../frame_metadata/mod.ts";
import * as author from "../known/rpc/author.ts";
import { Config } from "../mod.ts";
import * as ss58 from "../ss58/mod.ts";
import * as U from "../util/mod.ts";
import { $extrinsic } from "./core/$extrinsic.ts";
import { deriveCodec } from "./core/deriveCodec.ts";
import { hexDecode } from "./core/hex.ts";
import { Metadata } from "./Metadata.ts";
import { RpcCall } from "./RpcCall.ts";
import { RpcSubscription } from "./RpcSubscription.ts";

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
> extends Z.Name {
  root;

  constructor(
    readonly config: Config,
    readonly props_: Props,
    readonly sign: Sign,
  ) {
    super();
    const props = props_ as Z.Rec$Access<Props>;
    const metadata_ = new Metadata(config);
    const deriveCodec_ = deriveCodec(metadata_);
    const $extrinsic_ = $extrinsic(deriveCodec_, metadata_, this.sign, config.addressPrefix);
    const runtimeVersion = new RpcCall(config, "state_getRuntimeVersion", []);
    const senderSs58 = Z.call(props.sender, function senderSs58(sender) {
      return ((): string => {
        switch (sender.type) {
          case "Id": {
            return ss58.encode(config.addressPrefix, sender.value);
          }
          // TODO: other types
          default: {
            unimplemented();
          }
        }
      })();
    });
    const accountNextIndex = new RpcCall(config, "system_accountNextIndex", [senderSs58]);
    const genesisHash = hexDecode(
      Z.sel(new RpcCall(config, "chain_getBlockHash", [0]), "result"),
    );
    const checkpointHash = props.checkpoint
      ? Z.call(props.checkpoint, function checkpointOrUndef(v) {
        return v ? U.hex.decode(v) : v;
      })
      : genesisHash;
    this.root = Z.call(
      Z.ls(
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
      ),
      async function formExtrinsicHex([
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
    WatchHandler extends U.CreateWatchHandler<author.TransactionStatus>,
  >(watchHandler: WatchHandler): SignedExtrinsicWatch<this, WatchHandler> {
    return new SignedExtrinsicWatch(this.config, this, watchHandler);
  }
}

// TODO: is this really required? Why not use the RPC call effect directly?
export class SignedExtrinsicWatch<
  SignedExtrinsic extends Z.$<U.Hex>,
  WatchHandler extends U.CreateWatchHandler<author.TransactionStatus>,
> extends Z.Name {
  root;

  constructor(
    readonly config: Config,
    readonly signedExtrinsic: SignedExtrinsic,
    readonly watchHandler: WatchHandler,
  ) {
    super();
    this.root = new RpcSubscription(
      config,
      "author_submitAndWatchExtrinsic",
      [signedExtrinsic],
      watchHandler,
      // TODO: use effect system for cbs such as this
      (ok) => new RpcCall(config, "author_unwatchExtrinsic", [ok.result]),
    );
  }
}
