require('isomorphic-fetch')

declare const global: any

// @ts-ignore
import { KeyValueStore } from '@dollarshaveclub/cloudworker/lib/kv'
global.STORE = new KeyValueStore()