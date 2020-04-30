#!/bin/bash -e
rm -rf cfscripts/tmp
mkdir cfscripts/tmp
parcel build $1 -d cfscripts/tmp/ -o worker.js
echo <<EOF
type = "javascript"
account_id = "2ae5ddc12fe01a282dd014d39792077a"

[env.test]
workers_dev = true
name = "dawnguide-test-cfscript"
kv-namespaces = [ 
  { binding = "STORE", id = "a3e453436131418082bd8ae822479c8a" }
]

[env.live]
workers_dev = true
name = "dawnguide-live-cfscript"
kv-namespaces = [ 
  { binding = "STORE", id = "d318bb77cf8c4d398b325e49b6e13f3b" } 
]
EOF > wrangler.toml
echo <<EOF
{
    "main": "worker.js",
}
EOF > package.json
cd cfscripts/tmp && wrangler publish
curl https://dawnguide-test-cfscript.suns.workers.dev