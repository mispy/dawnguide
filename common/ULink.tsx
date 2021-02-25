import _ from 'lodash'
import React from 'react'
import { isExternalUrl } from './utils'
import { IS_SERVER } from './settings'
/// #if CLIENT
import { useLocation } from 'react-router-dom'
import { HashLink as Link } from 'react-router-hash-link'
/// #endif

function inRouter(): boolean {
    try {
        useLocation()
        return true
    } catch (err) {
        return false
    }
}

export function ULink(props: { href: string, className?: string, children?: any }) {
    if (isExternalUrl(props.href) || _.last(props.href.split('/'))?.includes(".")) {
        return <a target="_blank" {...props} />
    } else if (IS_SERVER || !inRouter()) {
        return <a href={props.href} {..._.omit(props, 'href')} />
    } else {
        return <Link to={props.href} {..._.omit(props, 'href')} />
    }
}