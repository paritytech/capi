#!/usr/bin/env bash

echo "test args $1 $2 $3 $4 $5"

mkdir -p "$(dirname $GITHUB_STEP_SUMMARY)" && touch "$GITHUB_STEP_SUMMARY"
chmod -R 666 $GITHUB_STEP_SUMMARY

browser=[$4] || "--browser"

deno task capi -- deno run -A -r=http://localhost:4646/ .github/actions/troodontid/main.ts --dir $1 --importMap $2 --concurrency $3 $browser
