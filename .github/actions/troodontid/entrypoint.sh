#!/usr/bin/env bash

echo "test args $1 $2 $3 $4 $5"

ls -la /
deno task capi -- deno run -A -r=http://localhost:4646/ .github/actions/troodontid/main.ts --dir $1 --importMap $2
