#!/bin/sh
# Rebuild index.html (artifact format) and site/index.html (standalone) from parts/*
cd "$(dirname "$0")"
cat parts/a_head.html parts/b1_core.js parts/b2_props.js parts/b3_world.js parts/b4_ui.js > index.html
cp index.html artifacts/amorn-home.artifact.html
mkdir -p site
{ printf '<!doctype html>\n<html lang="th">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n'; cat index.html; printf '\n</html>\n'; } > site/index.html
echo built
