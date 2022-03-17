#!/usr/bin/env -S deno run -A --no-check=remote --import-map=import_map.json

import { runCmd } from "/_/util/runCmd.ts";

await runCmd(["deno", "cache", "--no-check=remote", "--import-map=import_map.json", "./target/_star.ts"]);
