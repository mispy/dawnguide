# Dawnguide ☀️📖

![](https://github.com/mispy/dawnguide/workflows/Test%20on%20commit/badge.svg)

Dawnguide is a small, specialized encyclopedia and spaced learning system for mental health strategies that are strongly supported by evidence. It aims to bridge the gap between the collective knowledge of the human mind that is locked away in scientific journals, and those who would most benefit from applying that knowledge in their own lives.

The site is a fully serverless isomorphic React app and runs on [Cloudflare Workers](https://workers.cloudflare.com/sites), using [Workers KV](https://developers.cloudflare.com/workers/reference/storage) for data storage.

This repository contains both the backend and frontend code for the site as well as the lesson and exercise content, under `lessons`. The code is MIT licensed, while the content is [CC-BY](https://creativecommons.org/licenses/by/2.0/).

## Development setup

1. You will need [node](https://nodejs.org/en/) and [yarn](https://yarnpkg.com/getting-started/install).

2. Inside the repo, run yarn to install dependencies.

    ```sh
    yarn
    ```

4. Run the webpack development server to build client assets.

    ```sh
    yarn client
    ```

3. Concurrently (e.g. in another terminal) run the backend http server.

    ```sh
    yarn server
    ```

That's it! The dev server should now be available at `http://localhost:3000`. The development database is just a json file that is generated at `store.json`.
