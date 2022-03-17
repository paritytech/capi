import { Type as t } from "x/typebox";

// TODO: determine right way to check for consistency between typebox-inferred and hand-written.
// Likely will be to use `conditional-type-checks`.

export enum ChainTypeKind {
  Development = "Development",
  Local = "Local",
  Live = "Live",
  Custom = "Custom",
}
interface ChainTypeBase<Kind extends ChainTypeKind> {
  readonly kind: Kind;
}
export type ChainType =
  | ChainTypeBase<ChainTypeKind.Development>
  | ChainTypeBase<ChainTypeKind.Local>
  | ChainTypeBase<ChainTypeKind.Live>
  | ChainTypeBase<ChainTypeKind.Custom> & { /* TODO: give better name than `0` */ 0: string };
const chainType = t.Union([
  t.Object({ kind: t.Literal("Development") }),
  t.Object({ kind: t.Literal("Local") }),
  t.Object({ kind: t.Literal("Live") }),
  t.Object({
    kind: t.Literal("Custom"),
    0: t.String(),
  }),
]);

// TODO: confirm shape with someone more familiar
export interface ChainSpec {
  readonly name: string;
  readonly id: string;
  readonly chainType: ChainType;
  readonly bootNodes: string[];
  readonly telemetryEndpoints?: [string, number][];
  readonly protocolId?: string;
  readonly properties: Record<string, unknown>;
  readonly forkBlocks?: unknown; // TODO
  readonly badBlocks?: unknown; // TODO
  readonly consensusEngine?: unknown;
  readonly genesis: {
    readonly stateRootHash: string;
  };
  readonly lightSyncState: {
    readonly babeEpochChanges: string;
    readonly babeFinalizedBlockWeight: number;
    readonly finalizedBlockHeader: string;
    readonly grandpaAuthoritySet: string;
  };
}
export const chainSpec = t.Object({
  name: t.String(),
  id: t.String(),
  chainType,
  bootNodes: t.Array(t.String()),
  telemetryEndpoints: t.Optional(t.Tuple([t.String(), t.Number()])),
  protocolId: t.Optional(t.String()),
  properties: t.Record(t.String(), t.Unknown()),
  forkBlocks: t.Optional(t.Unknown()),
  badBlocks: t.Optional(t.Unknown()),
  consensusEngine: t.Optional(t.Unknown()),
  genesis: t.Object({
    stateRootHash: t.String(),
  }),
  lightSyncState: t.Object({
    babeEpochChanges: t.String(),
    babeFinalizedBlockWeight: t.String(),
    finalizedBlockHeader: t.String(),
    grandpaAuthoritySet: t.String(),
  }),
});
