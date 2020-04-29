#!/bin/bash -e
rm -rf cfscripts/tmp
mkdir cfscripts/tmp
parcel build $1 -d cfscripts/tmp/ -o worker.js
cd cfscripts && wrangler publish --env test
curl https://dawnguide-test-cfscript.suns.workers.dev