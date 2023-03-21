#!/usr/bin/env bash

echo "test args $1 $2 $3 $4 $5"

mkdir -p "$(dirname $GITHUB_STEP_SUMMARY)" && touch "$GITHUB_STEP_SUMMARY"
chmod -R 666 $GITHUB_STEP_SUMMARY

browser=[$4] || "--browser"

deno run -A /trun/validate_ignore.ts --dir examples
deno run -A _tasks/star.ts
deno task cache target/star.ts
deno task capi -- deno run -A -r=http://localhost:4646/ /trun/main.ts --dir $1 --import-map $2 --concurrency $3 $browser
