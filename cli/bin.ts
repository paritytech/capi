#!/usr/bin/env -S deno run -A --no-check=remote

import { NAME } from "/_/constants/project_meta.ts";
import { VERSION } from "/_/constants/version.ts";
import * as c from "/cli/cmd-ts.ts";
import * as cmds from "/cli/cmds/mod.ts";

await c.run(
  c.subcommands({
    version: VERSION,
    name: NAME,
    description: "Capi CLI root command description",
    cmds,
  }),
  Deno.args,
);
