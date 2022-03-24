// import { initLogs } from "/cli/logging.ts";
import { RawConfig } from "/config/Raw.ts";
import { validateConfig } from "/config/validate.ts";
import * as path from "std/path/mod.ts";

export class Config implements RawConfig {
  chains;
  lock;
  target;

  baseDirAbs;
  configPathAbs;
  configPathCwdRelative;
  outDirAbs;

  constructor(
    readonly configPath: string,
    readonly baseDir: string,
  ) {
    // TODO: flesh out CLI-wide logging story.
    // const validationLogs = initLogs();

    // TODO: more normalization? What if a user supplies an already-absolute path?
    this.baseDirAbs = path.join(Deno.cwd(), baseDir);
    this.configPathAbs = path.join(this.baseDirAbs, configPath);
    this.configPathCwdRelative = path.relative(Deno.cwd(), this.configPathAbs);

    const rawConfig = JSON.parse(new TextDecoder().decode(Deno.readFileSync(this.configPathCwdRelative)));
    const validationResult = validateConfig(rawConfig);
    switch (validationResult._tag) {
      case "RawConfig": {
        const raw = validationResult.rawConfig;
        this.chains = raw.chains;
        this.lock = raw.lock;
        this.target = raw.target;
        break;
      }
      case "Diagnostics": {
        // validationLogs; // TODO: add to these
        console.error("TODO: validation errs here");
        Deno.exit(1);
      }
    }

    this.outDirAbs = path.join(this.baseDirAbs, this.target.outDir);
  }
}
