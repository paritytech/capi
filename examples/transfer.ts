// import { WESTEND_RPC_URL } from "/constants/chains/url.ts";
// import * as C from "/mod.ts";
import * as crypto from "/crypto/mod.ts";
import * as M from "/frame_metadata/mod.ts";
import * as C from "/mod.ts";
import "std/dotenv/load.ts";
import * as hex from "std/encoding/hex.ts";
import * as $ from "x/scale/mod.ts";

// Make sure you have these in a project-root-level `.env`
const PUB_KEY = Deno.env.get("PUB_KEY")!;
const PRIV_KEY = Deno.env.get("PRIV_KEY")!;

const client = await C.wsRpcClient(C.WESTEND_RPC_URL);
const metadataRaw = await C.call(client, "state_getMetadata", []);
if (C.isOkRes(metadataRaw)) {
  const metadata = M.fromPrefixedHex(metadataRaw.result);
  const lookup = new M.Lookup(metadata);
  const balances = lookup.getPalletByName("Balances");
  const call = lookup.getCallByPalletAndName(balances, "transfer");
  const deriveCodec = M.DeriveCodec(metadata);
  const callParamsCodec = $.tuple(
    ...call.fields.map((field) => {
      return deriveCodec(field.type);
    }),
  );

  await client.close();
}
