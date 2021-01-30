import _ from 'lodash'
import React from 'react'
import { Link } from 'react-router-dom'
import { isExternalUrl } from './utils'
import { IS_SERVER } from './settings'

export function ULink(props: { href: string, className?: string, children?: any }) {
    if (isExternalUrl(props.href)) {
        return <a target="_blank" {...props} />
    } else if (IS_SERVER) {
        return <a href={props.href} {..._.omit(props, 'href')} />
    } else {
        return <Link to={props.href} {..._.omit(props, 'href')} />
    }
}