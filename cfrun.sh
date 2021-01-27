#!/bin/bash -e

if [ "$1" == "live" ]; then
  STORE_ID="d318bb77cf8c4d398b325e49b6e13f3b"
  WORKER_NAME="dawnguide-live-cfscript"
elif [ "$1" == "test" ]; then
  STORE_ID="a3e453436131418082bd8ae822479c8a"
  WORKER_NAME="dawnguide-test-cfscript"
else
  echo "Need to choose live or test"
  exit 1
fi  

# From https://gist.github.com/earthgecko/3089509#gistcomment-2140400
HASH=$(cat $2 | md5)

rm -rf cfscripts/tmp
mkdir cfscripts/tmp

CFSCRIPT_HASH=$HASH ./node_modules/.bin/webpack --config webpack.server.config.js --entry $2 --output-path ./cfscripts/tmp --output-filename worker.js

cat << EOF > cfscripts/tmp/wrangler.toml
type = "javascript"
account_id = "2ae5ddc12fe01a282dd014d39792077a"
workers_dev = true
name = "$WORKER_NAME"
kv-namespaces = [ 
  { binding = "STORE", id = "$STORE_ID" } 
]
EOF
cat << EOF > cfscripts/tmp/package.json
{
    "main": "worker.js"
}
EOF
cd cfscripts/tmp && ../../node_modules/.bin/wrangler publish
sleep 1
curl https://$WORKER_NAME.suns.workers.dev/$HASH