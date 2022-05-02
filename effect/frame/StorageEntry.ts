import { AnyEffect, AnyEffectA, Effect } from "/effect/Base.ts";
import { RpcCall, rpcCall } from "/effect/primitive/RpcCall.ts";
import { Lift, lift } from "/effect/std/Lift.ts";
import * as s from "x/scale/mod.ts";

export class StorageEntryError extends Error {}

export interface StorageEntryResolved {
  decoded: unknown;
}

export class StorageEntry<
  Beacon extends AnyEffect,
  Key extends AnyEffectA<string>,
  ValueCodec extends AnyEffectA<s.Codec>,
> extends Effect<
  {},
  StorageEntryError,
  StorageEntryResolved,
  [RpcCall<Beacon, Lift<"state_getStorage">, [Key]>, ValueCodec]
> {
  constructor(
    beacon: Beacon,
    key: Key,
    valueCodec: ValueCodec,
  ) {
    const stateGetStorageCall = rpcCall(beacon, lift("state_getStorage" as const), key);
    // TODO: make resolved naming consistent
    super([stateGetStorageCall, valueCodec], async (_, { result }, valueCodec) => {
      return {
        // TODO
        decoded: undefined, // valueCodec.decode(result);
      };
    });
  }
}

export const storageEntry = <
  Beacon extends AnyEffect,
  Key extends AnyEffectA<string>,
  ValueCodec extends AnyEffectA<s.Codec>,
>(
  beacon: Beacon,
  key: Key,
  valueCodec: ValueCodec,
): StorageEntry<Beacon, Key, ValueCodec> => {
  return new StorageEntry(beacon, key, valueCodec);
};
