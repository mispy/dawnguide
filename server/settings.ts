// Set global vars on CF worker with "wrangler secret" command, accessible at runtime

declare const global: any
declare const process: any

export const IS_PRODUCTION: boolean = global.BASE_URL && !global.BASE_URL.includes("localhost")

export const IS_TESTING: boolean = typeof jest !== 'undefined'

export const ADMIN_SECRET: string = global.ADMIN_SECRET || process.env.ADMIN_SECRET || ""

export const DEPLOY_ENV = IS_PRODUCTION ? (global.BASE_URL.includes("dawnguide.com") ? "live" : "staging") : "dev"

export const ASSET_DEV_SERVER: string = "http://localhost:1234"

export const STRIPE_SECRET_KEY: string = global.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY || ""
export const STRIPE_WEBHOOK_SECRET: string = global.STRIPE_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRET || ""

export const SENDGRID_SECRET_KEY: string = global.SENDGRID_SECRET_KEY || process.env.SENDGRID_SECRET_KEY || ""

export const SENTRY_KEY = DEPLOY_ENV === 'live' ? '53f7b86d9a174f81a3fad700135ee4eb' : ''
export const SENTRY_PROJECT_ID = '5189056'

export const MAILGUN_SECRET: string = global.MAILGUN_SECRET || process.env.MAILGUN_SECRET || ""

export const CONTACT_FORM_EMAIL: string = "foldspark@gmail.com"