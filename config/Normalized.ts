// import { initLogs } from "/cli/logging.ts";
import { validateConfig } from "/config/validate.ts";
import * as path from "std/path/mod.ts";

export interface ConfigProps {
  configPath: string;
  baseDir: string;
  outDir: string;
}

export class Config {
  baseDirAbs;
  configPathAbs;
  configPathCwdRelative;
  configRaw;
  outDirAbs;

  constructor(props: ConfigProps) {
    // TODO: flesh out CLI-wide logging story.
    // const validationLogs = initLogs();

    // TODO: more normalization? What if a user supplies an already-absolute path?
    this.baseDirAbs = path.join(Deno.cwd(), props.baseDir);
    this.configPathAbs = path.join(this.baseDirAbs, props.configPath);
    this.configPathCwdRelative = path.relative(Deno.cwd(), this.configPathAbs);
    this.outDirAbs = path.join(this.baseDirAbs, props.outDir);

    const rawConfig = JSON.parse(new TextDecoder().decode(Deno.readFileSync(this.configPathCwdRelative)));
    const validationResult = validateConfig(rawConfig);
    switch (validationResult._tag) {
      case "RawConfig": {
        this.configRaw = validationResult.rawConfig;
        break;
      }
      case "Diagnostics": {
        // validationLogs; // TODO: add to these
        console.error("TODO: validation errs here");
        Deno.exit(1);
      }
    }
  }
}
