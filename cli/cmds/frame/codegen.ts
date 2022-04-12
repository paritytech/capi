import * as c from "/cli/cmd-ts.ts";
import * as common from "/cli/common.ts";
import { Config } from "/config/mod.ts";
import { FrameCodegen } from "/frame_codegen/mod.ts";
import * as fs from "std/fs/mod.ts";
import ts from "typescript";
import { createFromBuffer } from "x/dprint/mod.ts";
import dprintConfig from "../../../dprint.json" assert { type: "json" };

export const codegen = c.command({
  name: "codegen",
  args: {
    ...common.args,
    noClean: c.flag({
      long: "no-clean",
      defaultValue() {
        return false;
      },
    }),
  },
  async handler(args) {
    const config = new Config(args.config, args.baseDir);
    const printer = ts.createPrinter({
      omitTrailingSemicolon: false,
      removeComments: false,
    });
    if (!args.noClean) {
      await fs.emptyDir(config.outDirAbs);
    }

    const context = new FrameCodegen(config);
    await context.update();

    const pending: Promise<void>[] = [];
    const format = config.target.skipFormatting
      ? ((_0: string, source: string): string => source)
      : (() => {
        const formatter = createFromBuffer(Deno.readFileSync("_/assets/dprint_typescript.wasm"));
        formatter.setConfig({ indentWidth: dprintConfig.indentWidth }, dprintConfig.typescript);
        return formatter.formatText;
      })();
    for await (const sourceFile of context.sourceFiles()) {
      pending.push((async () => {
        // console.log(`Writing "${sourceFile.fileName}"`);
        await fs.ensureFile(sourceFile.fileName);
        const generated = printer.printFile(sourceFile);
        const formatted = format(sourceFile.fileName, generated);
        await Deno.writeFile(sourceFile.fileName, new TextEncoder().encode(formatted));
      })());
    }
    await Promise.all(pending);
  },
});
