declare const window: any
declare const global: any

let isServer: boolean = true
/// #if CLIENT
isServer = false
/// #endif

export const IS_SERVER = isServer

export const MONTHLY_PLAN_ID = 'dawnguide_monthly'
export const ANNUAL_PLAN_ID = 'dawnguide_annual'
export const BASE_URL: string = IS_SERVER ? (global.BASE_URL || process.env.BASE_URL || "http://localhost:3000") : window.location.origin