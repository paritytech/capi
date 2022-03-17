import * as c from "/cli/cmd-ts.ts";
import { codegen } from "/cli/cmds/frame/codegen.ts";

export const frame = c.subcommands({
  name: "frame",
  cmds: {
    codegen,
  },
});
