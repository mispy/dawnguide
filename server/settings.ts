export const IS_PRODUCTION = !!(global as any).__STATIC_CONTENT

export const WEBPACK_DEV_SERVER = "http://localhost:8020"

export const BASE_URL = IS_PRODUCTION ? "https://sunpeep.suns.workers.dev" : "http://localhost:3000"