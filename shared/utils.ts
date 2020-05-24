
import { BASE_URL } from './settings'
import urljoin from 'url-join'

export function isExternalUrl(href: string): boolean {
    return isAbsoluteUrl(href) && !href.startsWith(BASE_URL)
}

export function isAbsoluteUrl(href: string): boolean {
    return href.startsWith("http://") || href.startsWith("https://")
}

export function absurl(path: string): string {
    console.log(BASE_URL, path)
    if (isAbsoluteUrl(path)) {
        return path
    } else {
        return urljoin(BASE_URL, path)
    }
}
