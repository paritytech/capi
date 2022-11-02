import { unimplemented } from "../deps/std/testing/asserts.ts";
import { equal } from "../deps/std/testing/asserts.ts";
import * as Z from "../deps/zones.ts";
import * as M from "../frame_metadata/mod.ts";
import * as known from "../known/mod.ts";
import * as rpc from "../rpc/mod.ts";
import * as ss58 from "../ss58/mod.ts";
import * as U from "../util/mod.ts";
import { $extrinsic } from "./$extrinsic.ts";
import { blockRead } from "./blockRead.ts";
import { const as const_ } from "./const.ts";
import { deriveCodec } from "./deriveCodec.ts";
import { entryRead } from "./entryRead.ts";
import { metadata } from "./metadata.ts";
import { author, chain, system } from "./rpc_known.ts";
import * as e$ from "./scale.ts";

const k0_ = Symbol();

export interface CallData {
  palletName: string;
  methodName: string;
  args: Record<string, unknown>;
}

export interface ExtrinsicProps extends CallData {
  sender: M.MultiAddress;
  checkpoint?: U.HexHash;
  mortality?: [period: bigint, phase: bigint];
  nonce?: string;
  tip?: bigint;
}

export function extrinsic<Client extends Z.$<rpc.Client>>(client: Client) {
  return <Props extends Z.Rec$<ExtrinsicProps>>(props: Props): Extrinsic<Client, Props> => {
    return new Extrinsic(client, props);
  };
}

export class Extrinsic<
  Client extends Z.$<rpc.Client>,
  Props extends Z.Rec$<ExtrinsicProps>,
> {
  constructor(
    readonly client: Client,
    readonly props: Props,
  ) {}

  signed<Sign extends Z.$<M.Signer>>(sign: Sign): SignedExtrinsic<Client, Props, Sign> {
    return new SignedExtrinsic(this.client, this.props, sign);
  }
}

export class SignedExtrinsic<
  Client extends Z.$<rpc.Client>,
  Props extends Z.Rec$<ExtrinsicProps>,
  Sign extends Z.$<M.Signer>,
> {
  client;
  props;
  sign;
  extrinsicBytes;
  extrinsicHex;
  extrinsicDecoded;

  constructor(
    client: Client,
    props: Props,
    sign: Sign,
  ) {
    this.client = client as Client;
    this.props = props as Z.Rec$Access<Props>;
    this.sign = sign as Sign;

    const metadata_ = metadata(this.client)();
    const deriveCodec_ = deriveCodec(metadata_);
    const addrPrefix = const_(this.client)("System", "SS58Prefix")
      .access("value")
      .as<number>();
    const $extrinsic_ = $extrinsic(deriveCodec_, metadata_, this.sign, addrPrefix);
    const versions = const_(this.client)("System", "Version")
      .access("value");
    const specVersion = versions
      .access("spec_version").as<number>();
    const transactionVersion = versions
      .access("transaction_version").as<number>();
    // TODO: create match effect in zones and use here
    // TODO: MultiAddress conversion utils
    const senderSs58 = Z.ls(addrPrefix, this.props.sender).next(([addrPrefix, sender]) => {
      switch (sender.type) {
        case "Id": {
          return ss58.encode(addrPrefix, sender.value);
        }
        default: {
          unimplemented();
        }
      }
    }, k0_);
    const nonce = system.accountNextIndex(this.client)(senderSs58);
    const genesisHashBytes = chain.getBlockHash(this.client)(0);
    const genesisHash = genesisHashBytes.next(U.hex.decode);
    const checkpointHash = this.props.checkpoint
      ? Z.option(this.props.checkpoint, U.hex.decode)
      : genesisHash;
    const mortality = Z
      .lift(this.props.mortality)
      .next((mortality) => {
        return mortality
          ? M.era.mortal(mortality[0], mortality[1])
          : M.era.immortal;
      });
    const extra = Z.ls(mortality, nonce, this.props.tip || 0);
    const additional = Z.ls(specVersion, transactionVersion, checkpointHash, genesisHash);
    const signature = Z.rec({ address: this.props.sender, extra, additional });
    const $extrinsicProps = Z.rec({
      protocolVersion: 4,
      palletName: this.props.palletName,
      methodName: this.props.methodName,
      args: this.props.args,
      signature,
    });
    this.extrinsicBytes = e$.scaleEncoded($extrinsic_, $extrinsicProps, true);
    this.extrinsicHex = this.extrinsicBytes.next(U.hex.encode);
    this.extrinsicDecoded = e$.scaleDecoded($extrinsic_, this.extrinsicBytes, "extrinsic");
  }

  watch<Listener extends Z.$<U.Listener<known.TransactionStatus, rpc.ClientSubscribeContext>>>(
    listener: Listener,
  ) {
    const subscriptionId = author.submitAndWatchExtrinsic(this.client)(
      [this.extrinsicHex],
      listener,
    );
    return author.unwatchExtrinsic(this.client)(subscriptionId)
      .zoned("ExtrinsicWatch");
  }

  get sent() {
    return author.submitExtrinsic(this.client)(this.extrinsicHex);
  }
}

export function extrinsicEvents<
  Extrinsic extends SignedExtrinsic,
  FinalizedHash extends known.Hash,
>(
  extrinsic: Extrinsic,
  finalizedHash: FinalizedHash,
) {
  const client = extrinsic.props.client as Extrinsic["props"]["client"];
  const extrinsics = blockRead(client)(
    finalizedHash,
  )
    .access("block")
    .access("extrinsics");
  const idx = Z.ls(
    extrinsics,
    extrinsic.extrinsicDecoded as Extrinsic["extrinsicDecoded"],
  ).next(([extrinsics, extrinsicDecoded]) => {
    return extrinsics.findIndex((v) => equal(v, extrinsicDecoded));
  });
  const events = entryRead(client)("System", "Events", [], finalizedHash)
    .access("value")
    .as<{ phase: { value: number } }[]>(); // TODO: do we want to hard-code the event type / sp types generally?
  return Z.ls(idx, events).next(([idx, events]) => {
    return events.filter((event) => {
      return event.phase.value === idx;
    });
  });
}
