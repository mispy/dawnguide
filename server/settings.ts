// Set global vars on CF worker with "wrangler secret" command, accessible at runtime

declare const global: any
declare const process: any

export const IS_PRODUCTION: boolean = global.BASE_URL && !global.BASE_URL.includes("localhost")

export const WEBPACK_DEV_SERVER: string = "http://localhost:1234"

export const BASE_URL: string = global.BASE_URL || process.env.BASE_URL || (IS_PRODUCTION ? "https://sunpeep.suns.workers.dev" : "http://localhost:3000")

export const STRIPE_SECRET_KEY: string = global.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY || ""

export const SENDGRID_SECRET_KEY: string = global.SENDGRID_SECRET_KEY || process.env.SENDGRID_SECRET_KEY || ""