#!/usr/bin/env bash

echo "test args $1 $2 $3 $4 $5"

echo $GITHUB_STEP_SUMMARY
mkdir -p "$(dirname $GITHUB_STEP_SUMMARY)" && touch "$GITHUB_STEP_SUMMARY"
RUN ls -la $GITHUB_STEP_SUMMARY
deno task capi -- deno run -A -r=http://localhost:4646/ .github/actions/troodontid/main.ts --dir $1 --importMap $2
