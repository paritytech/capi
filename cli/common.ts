import * as c from "/cli/cmd-ts.ts";

const ensureOptionRec = <R extends Record<string, ReturnType<typeof c.option>>>(optionRec: R): R => {
  return optionRec;
};

export const args = ensureOptionRec({
  config: c.option({
    type: c.string,
    long: "config",
    short: "c",
    description: "Path to your Capi config file.",
    defaultValueIsSerializable: true,
    env: "CAPI_CONFIG_PATH",
    defaultValue() {
      return "capi.jsonc";
    },
  }),
  baseDir: c.option({
    type: c.string,
    long: "base-dir",
    description: "The cwd-relative base path off of which other paths are specified.",
    defaultValueIsSerializable: true,
    env: "CAPI_CONFIG_BASE_DIR",
    defaultValue() {
      return ".";
    },
  }),
});
