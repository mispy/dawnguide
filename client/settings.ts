
declare const process: any

export const IS_PRODUCTION = !window.location.origin.includes('localhost')

export const STRIPE_PUBLIC_KEY = "pk_test_mfLIw9GyX5nCZBKawbFMJV6P"

export const API_BASE_URL = `${window.location.origin}`

export const SENTRY_DSN_URL = !IS_PRODUCTION ? "" : "https://06f1b7e599f64846b5e233c79e83b6fb@sentry.io/5184428"