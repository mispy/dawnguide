# workers-example

Proof of concept full-stack site w/ registration + auth on cloudflare workers

To deploy:

- `cp wrangler.toml.example wrangler.toml` and populate
- `wrangler kv:namespace create "STORE"` to make kv store, add to wrangler.toml
- `webpack -p` in client
- `webpack -p` in server
- `wrangler publish` from root

Deployment is currently: run `webpack -p` in both client and server dirs, then `wrangler publish` from root