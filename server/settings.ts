declare const global: any
declare const process: any

export const IS_PRODUCTION: boolean = !!(global as any).__STATIC_CONTENT

export const WEBPACK_DEV_SERVER: string = "http://localhost:8020"

export const BASE_URL: string = IS_PRODUCTION ? "https://sunpeep.suns.workers.dev" : "http://localhost:3000"

export const STRIPE_SECRET_KEY: string = process.env.STRIPE_SECRET_KEY || ""