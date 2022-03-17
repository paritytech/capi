#!/usr/bin/env -S deno run -A --no-check=remote --import-map=import_map.json

import * as path from "std/path/mod.ts";

if (path.dirname(path.dirname(new URL(import.meta.url).pathname)) !== Deno.cwd()) {
  throw new Error("Must run tasks from project root.");
}

const [which] = Deno.args;
if (!which) {
  throw new Error("Must specify which tasks to run as first positional.");
}

const whichWithExtension = `${which}.ts`;

try {
  Deno.lstat(path.resolve(Deno.cwd(), "_", "tasks", whichWithExtension));
} catch (_e) {
  throw new Error(`Could not find "${which}" task.`);
}

import(`./tasks/${whichWithExtension}`);
