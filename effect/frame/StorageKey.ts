import { AnyEffect, AnyEffectA, Effect } from "/effect/Base.ts";
import { RpcCall, rpcCall } from "/effect/primitive/RpcCall.ts";
import { Lift, lift } from "/effect/std/Lift.ts";
import * as m from "/frame_metadata/mod.ts";
import { DeriveCodec, deriveCodec } from "./DeriveCodec.ts";

export class StorageKeyError extends Error {}

export interface StorageKeyResolved {
  decoded: unknown;
}

export class StorageKey<R, D extends AnyEffect[]> extends Effect<
  R,
  StorageKeyError,
  StorageKeyResolved,
  D
> {}

export namespace StorageKey {
  export const from = <
    Beacon extends AnyEffectA<string>,
    PalletName extends AnyEffectA<string>,
    StorageEntryName extends AnyEffectA<string>,
    KeyA extends AnyEffectA<unknown>,
    KeyB extends AnyEffectA<unknown>,
  >(
    beacon: Beacon,
    palletName: PalletName,
    storageEntryName: StorageEntryName,
    keyA: KeyA,
    keyB: KeyB,
  ): StorageKey<{ hashers: m.HasherLookup }, [DeriveCodec<Beacon>, PalletName, StorageEntryName, KeyA, KeyB]> => {
    // TODO: make resolved naming consistent
    return new StorageKey(
      [deriveCodec(beacon), palletName, storageEntryName, keyA, keyB],
      async (runtime, deriveCodec, palletName, storageEntryName, keyA, keyB) => {
        m.encodeKey(deriveCodec, runtime.hashers);
        resolved.result;
      },
    );
  };
}
