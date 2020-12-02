import * as React from 'react'
import LibMarkdown, { MarkdownOptions } from 'markdown-to-jsx'
import { SmartLink } from './Passage'

/** Wrap markdown-to-jsx with Dawnguide defaults */
export function Markdown(props: { options?: MarkdownOptions, overrides?: any, children: any }) {
    const options = Object.assign({
        overrides: Object.assign({
            a: SmartLink
        }, props.overrides)
    }, props.options)
    return <LibMarkdown options={options}>{props.children}</LibMarkdown>
}