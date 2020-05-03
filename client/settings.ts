
declare const process: any

export const IS_PRODUCTION = !window.location.origin.includes('localhost')

export const STRIPE_PUBLIC_KEY = IS_PRODUCTION ? "pk_live_PK28XpFQ6PvWfTzMljEe97ND00q1Bm5Kor" : "pk_test_V6b2H2AFMzPTPmdfF89f505q00jklfw0PJ"

export const API_BASE_URL = `${window.location.origin}`

export const SENTRY_DSN_URL = !IS_PRODUCTION ? "" : "https://06f1b7e599f64846b5e233c79e83b6fb@sentry.io/5184428"