import { unimplemented } from "../deps/std/testing/asserts.ts";
import * as Z from "../deps/zones.ts";
import * as M from "../frame_metadata/mod.ts";
import * as known from "../known/mod.ts";
import * as rpc from "../rpc/mod.ts";
import * as ss58 from "../ss58/mod.ts";
import * as U from "../util/mod.ts";
import { const as const_ } from "./const.ts";
import { $extrinsic } from "./core/$extrinsic.ts";
import { deriveCodec } from "./core/deriveCodec.ts";
import { hexDecode } from "./core/hex.ts";
import { metadata } from "./metadata.ts";
import { author, chain, system } from "./rpc/known.ts";

export interface CallData {
  palletName: string;
  methodName: string;
  args: Record<string, unknown>;
}

export interface ExtrinsicProps extends CallData {
  client: rpc.Client;
  sender: M.MultiAddress;
  checkpoint?: U.HexHash;
  mortality?: [period: bigint, phase: bigint];
  nonce?: string;
  tip?: bigint;
}

export function extrinsic<Props extends Z.Rec$<ExtrinsicProps>>(props: Props): Extrinsic<Props> {
  return new Extrinsic(props);
}

export class Extrinsic<Props extends Z.Rec$<ExtrinsicProps>> {
  constructor(readonly props: Props) {}

  signed<Sign extends Z.$<M.SignExtrinsic>>(sign: Sign): SignedExtrinsic<Props, Sign> {
    return new SignedExtrinsic(this.props, sign);
  }
}

export class SignedExtrinsic<
  Props extends Z.Rec$<ExtrinsicProps>,
  Sign extends Z.$<M.SignExtrinsic>,
> {
  extrinsic;

  constructor(readonly props_: Props, readonly sign: Sign) {
    const props = props_ as Z.Rec$Access<Props>;
    const metadata_ = metadata(props.client)();
    const deriveCodec_ = deriveCodec(metadata_);
    const addrPrefix = const_(props.client)("System", "SS58Prefix").access("value").as<number>();
    const $extrinsic_ = $extrinsic(deriveCodec_, metadata_, this.sign, addrPrefix);
    const versions = const_(props.client)("System", "Version").access("value");
    const specVersion = versions.access("spec_version").as<number>();
    const transactionVersion = versions.access("transaction_version").as<number>();
    const senderSs58 = Z.call(
      Z.ls(addrPrefix, props.sender),
      function senderSs58([addrPrefix, sender]) {
        switch (sender.type) {
          case "Id": {
            return ss58.encode(addrPrefix, sender.value);
          }
          // TODO: other types
          default: {
            unimplemented();
          }
        }
      },
    );
    const nonce = system.accountNextIndex(props.client)(senderSs58);
    const genesisHash = hexDecode(chain.getBlockHash(props.client)(0));
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

  watch<Listener extends Z.$<U.Listener<known.TransactionStatus, rpc.ClientSubscribeContext>>>(
    listener: Listener,
  ) {
    const subscriptionId = author.submitAndWatchExtrinsic(
      this.props_.client as Props["client"],
    )([this.extrinsic], listener);
    return author.unwatchExtrinsic(this.props_.client as Props["client"])(subscriptionId)
      .zoned("ExtrinsicWatch");
  }

  get sent() {
    return author.submitExtrinsic(this.props_.client as Props["client"])(this.extrinsic)
      .zoned("ExtrinsicSent");
  }
}
