# Troodontid

A testing tool to ensure that a script(s) exits successfully, both in Deno and browser (puppeteered) environments.

## Setup

Add a task to the `deno.jsonc` file in your project:

```json
{
  "tasks": {
    "troo": "deno run -A https://deno.land/x/troodontid@VERSION_GOES_HERE/main.ts"
  }
}
```

## Running

```sh
deno task troo [flags]
```

## CLI Flags

- `--debug` - Build without optimizations.
- `--project` - <crate_name> / -p <crate_name> - Specifies the crate to build when using a Cargo workspace.
- `--out <dir_path>` - Specifies the output directory. Defaults to ./lib
- `--js-ext <ext_no_period>` - Extension to use for the wasm-bindgen JS file. Defaults to js.
- `--all-features` - Build the crate with all features.
- `--no-default-features` - Build the crate with no default features.
- `--features` - Specify the features to create. Specify multiple features quoted and with spaces (ex. --features "wasm serialization").
- `--sync` - Generate a synchronous module that stores the Wasm module inline as base64 text.
- `--skip-opt` - Skip running wasm-opt.
- `--check` - Checks if the output is up-to-date.
