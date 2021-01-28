
import { BASE_URL } from './settings'
import urljoin from 'url-join'
import _ from 'lodash'

export function isExternalUrl(href: string): boolean {
    return isAbsoluteUrl(href) && !href.startsWith(BASE_URL)
}

export function isAbsoluteUrl(href: string): boolean {
    return href.startsWith("http://") || href.startsWith("https://")
}

export function absurl(path: string): string {
    if (isAbsoluteUrl(path)) {
        return path
    } else {
        return urljoin(BASE_URL, path)
    }
}

export type Json = { [key: string]: string | number | Json | null | undefined }

/** Expect a given json object to resolve some keys to string values */
export function expectStrings<U extends keyof Json>(json: Json, ...keys: U[]): Pick<{ [key: string]: string }, U> {
    const obj: any = {}
    for (const key of keys) {
        const val = json[key]
        if (!_.isString(val)) {
            throw new Error(`Expected string value for ${key} in object ${JSON.stringify(json)}`)
        }
        obj[key] = val
    }
    return obj
}

export function tryParseJson(maybe: any): object | undefined {
    try {
        const result = JSON.parse(maybe)
        if (result && _.isObject(result)) {
            return result
        } else {
            return undefined
        }
    } catch (err) {
        return undefined
    }
}