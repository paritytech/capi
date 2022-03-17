import { VERSION } from "/_/constants/version.ts";
import { f, Factory } from "/codegen/common.ts";
import * as path from "std/path/mod.ts";
import ts from "typescript";

export const Import = (
  sourceFileDir: string,
  bindingName: ts.Identifier,
  ...subpaths: string[]
): Factory<[ts.ImportDeclaration]> => {
  return (config) => {
    let importUri: string;

    const subpathsJoinedForUrl = subpaths.join("/");

    switch (config.configRaw.target.capi) {
      case "denoland_x": {
        importUri = `https://deno.land/x/capi@${VERSION}/${subpathsJoinedForUrl}.ts`;
        break;
      }
      case "npm": {
        importUri = `capi/${subpathsJoinedForUrl}`;
        break;
      }
      default: {
        importUri = [
          path.relative(
            sourceFileDir,
            path.join(config.baseDirAbs, config.configRaw.target.capi.vendored),
          ).split(path.sep).join("/"),
          subpaths.join("/").concat(".ts"),
        ].join("/");
      }
    }

    return [f.createImportDeclaration(
      undefined,
      undefined,
      f.createImportClause(
        false,
        undefined,
        f.createNamespaceImport(bindingName),
      ),
      f.createStringLiteral(importUri),
      undefined,
    )];
  };
};
