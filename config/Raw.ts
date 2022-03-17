import { chainSpec } from "/config/ChainSpec.ts";
import { Static, Type as t } from "x/typebox";

const ChainBeacon = t.Union([
  t.String({
    title: "Chain Beacon URI",
    format: "uri",
    examples: ["wss://rpc.polkadot.io"],
  }),
  t.Array(t.String({ format: "uri" }), {
    maxItems: 1,
    description: "List of chain RPC node WebSocket URIs which resolve to the same chain.",
    examples: [["wss://rpc.polkadot.io"]],
    uniqueItems: true,
    title: "Chain Beacon URIs",
  }),
  chainSpec, // TODO: do we want to allow devs to directly specificity a chain spec?
]);

export const configSchema = t.Object({
  chains: t.Record(
    t.String({
      title: "Chain Beacon Values Indexed By Target Name",
      maxLength: 1,
    }),
    ChainBeacon,
  ),
  lock: t.Optional(t.String()),
  // TODO: enable configuration of `env` (for watching changes to a local chain)
  target: t.Object({
    capi: t.Union(
      [
        t.Literal("denoland_x"),
        t.Literal("npm"),
        t.Object({
          vendored: t.String({
            title: "Path to vendored root.",
          }),
        }),
      ],
      {
        title: "Capi Path",
        description: "Where to resolve Chain API.",
      },
    ),
    outDir: t.String(),
    cache: t.Optional(t.String()),
    convenience: t.Optional(t.Union([
      t.Literal("smart_modules"),
      t.Literal("import_map"),
    ])),
    skipFormatting: t.Optional(t.Boolean()),
  }),
});

export type RawConfig = Static<typeof configSchema>;
