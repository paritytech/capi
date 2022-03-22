import { Config } from "/config/mod.ts";
import * as m from "/frame_metadata/mod.ts";
import * as path from "std/path/mod.ts";

export interface FrameTypeDescriptor {
  sourceFileDir: string;
  sourceFilePath: string;
  name: string;
  raw: m.Type;
}

export class FrameContext {
  outDir;
  typesOutDir;
  typeDescriptorByI: Record<number, FrameTypeDescriptor> = {};
  typeDescriptorByIEntries;

  constructor(
    readonly config: Config,
    readonly chainAlias: string,
    readonly beacon: string,
    readonly metadata: m.MetadataContainer,
  ) {
    this.outDir = path.join(config.outDirAbs, "frame", chainAlias);
    this.typesOutDir = path.join(this.outDir, "_types");

    for (let typeI = 0; typeI < metadata.raw.types.length; typeI++) {
      const raw = metadata.raw.types[typeI]!;
      if (raw.path.length > 0) {
        const nameI = raw.path.length - 1;
        const name = raw.path[nameI]!;
        const sourceFileDir = path.join(this.typesOutDir, ...raw.path.slice(0, nameI));
        const sourceFilePath = path.join(sourceFileDir, `${name}.ts`);
        this.typeDescriptorByI[typeI] = {
          sourceFileDir,
          sourceFilePath,
          name,
          raw,
        };
      }
    }

    this.typeDescriptorByIEntries = Object.entries(this.typeDescriptorByI);
  }
}
