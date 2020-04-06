// Ported to typescript from https://github.com/bustle/cf-sentry/blob/master/sentry.js

import { SENTRY_KEY, SENTRY_PROJECT_ID, DEPLOY_ENV } from "./settings"
import { EventRequest } from "./requests"
import _ = require("lodash")
import { Json } from "./utils"
import * as db from './db'

// Get the key from the "DSN" at: https://sentry.io/settings/<org>/projects/<project>/keys/
// The "DSN" will be in the form: https://<SENTRY_KEY>@sentry.io/<SENTRY_PROJECT_ID>
// eg, https://0000aaaa1111bbbb2222cccc3333dddd@sentry.io/123456

// Useful if you have multiple apps within a project – not necessary, only used in TAGS and SERVER_NAME below
const APP = 'dawnguide-worker'

// https://docs.sentry.io/error-reporting/configuration/?platform=javascript#environment

// https://docs.sentry.io/error-reporting/configuration/?platform=javascript#release
// A string describing the version of the release – we just use: git rev-parse --verify HEAD
// You can use this to associate files/source-maps: https://docs.sentry.io/cli/releases/#upload-files
// const RELEASE = '0000aaaa1111bbbb2222cccc3333dddd'

// https://docs.sentry.io/enriching-error-data/context/?platform=javascript#tagging-events
const TAGS = { app: APP }

// https://docs.sentry.io/error-reporting/configuration/?platform=javascript#server-name
const SERVER_NAME = `${APP}-${DEPLOY_ENV}`

// Indicates the name of the SDK client
const CLIENT_NAME = 'bustle-cf-sentry'
const CLIENT_VERSION = '1.0.0'
const RETRIES = 5

export async function logToSentry(err: Error, req: EventRequest) {
    const body = JSON.stringify(await toSentryEvent(err, req))

    for (let i = 0; i <= RETRIES; i++) {
        const res = await fetch(`https://sentry.io/api/${SENTRY_PROJECT_ID}/store/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Sentry-Auth': [
                    'Sentry sentry_version=7',
                    `sentry_timestamp=${Math.floor(Date.now() / 1000)}`,
                    `sentry_client=${CLIENT_NAME}/${CLIENT_VERSION}`,
                    `sentry_key=${SENTRY_KEY}`,
                ].join(', '),
            },
            body,
        })
        if (res.status === 200) {
            return
        }
        // We couldn't send to Sentry, try to log the response at least
        console.error({ httpStatus: res.status, ...(await res.json()) }) // eslint-disable-line no-console
    }
}

async function toSentryEvent(err: any, req: EventRequest) {
    const errType = err.name || (err.contructor || {}).name
    const frames = parse(err)
    const extraKeys = Object.keys(err).filter(key => !['name', 'message', 'stack'].includes(key))

    return {
        event_id: uuidv4(),
        message: errType + ': ' + (err.message || '<no message>'),
        exception: {
            values: [
                {
                    type: errType,
                    value: err.message,
                    stacktrace: frames.length ? { frames: frames.reverse() } : undefined,
                },
            ],
        },
        extra: extraKeys.length
            ? {
                [errType]: extraKeys.reduce((obj, key) => ({ ...obj, [key]: err[key] }), {}),
            }
            : undefined,
        tags: TAGS,
        platform: 'javascript',
        environment: DEPLOY_ENV,
        server_name: SERVER_NAME,
        timestamp: new Date().toJSON(),
        request: {
            method: req.method,
            url: req.url,
            query_string: req.url.search,
            headers: req.headers,
            data: req.json ? sanitize(req.json) : undefined,
        },
        user: req.session ? await userInfo(req.session) : undefined
        // release: RELEASE,
    }
}

function sanitize(json: Json) {
    if ('password' in json) {
        return Object.assign({}, json, { password: '********' })
    } else {
        return json
    }
}

async function userInfo(session: db.Session) {
    const user = await db.users.get(session.userId)
    if (user) {
        return {
            id: user.id,
            username: user.username,
            email: user.email
        }
    } else {
        return undefined
    }
}

function parse(err: Error) {
    return (err.stack || '')
        .split('\n')
        .slice(1)
        .map(line => {
            if (line.match(/^\s*[-]{4,}$/)) {
                return { filename: line }
            }

            // From https://github.com/felixge/node-stack-trace/blob/1ec9ba43eece124526c273c917104b4226898932/lib/stack-trace.js#L42
            const lineMatch = line.match(/at (?:(.+)\s+\()?(?:(.+?):(\d+)(?::(\d+))?|([^)]+))\)?/)
            if (!lineMatch) {
                return
            }

            return {
                function: lineMatch[1] || undefined,
                filename: lineMatch[2] || undefined,
                lineno: +lineMatch[3] || undefined,
                colno: +lineMatch[4] || undefined,
                in_app: lineMatch[5] !== 'native' || undefined,
            }
        })
        .filter(Boolean)
}

function uuidv4() {
    const bytes = new Uint8Array(16)
    crypto.getRandomValues(bytes)
    bytes[6] = (bytes[6] & 0x0f) | 0x40
    bytes[8] = (bytes[8] & 0x3f) | 0x80
    return [...bytes].map(b => ('0' + b.toString(16)).slice(-2)).join('') // to hex
}