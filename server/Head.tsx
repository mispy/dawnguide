import * as React from 'react'

import parcelManifestDev = require('../client/tmp/parcel-manifest.json')
import parcelManifestProd = require('../client/dist/parcel-manifest.json')
import { absurl } from './utils'

declare const process: any
function manifest(filename: string) {
    let parcelManifest
    if (process.env.NODE_ENV === 'development') {
        parcelManifest = parcelManifestDev
    } else {
        parcelManifest = parcelManifestProd
    }

    for (const key in parcelManifest) {
        if (key.split('/').slice(-1)[0] === filename) {
            return (parcelManifest as any)[key].replace("https:/", "https://")
        }
    }

    throw new Error(`Couldn't find ${filename} in manifest: ${JSON.stringify(parcelManifest)}`)
}

export const Head = (props: { canonicalUrl: string | null, pageTitle?: string, pageDesc?: string, imageUrl?: string, children?: any }) => {
    let { canonicalUrl } = props
    const pageTitle = props.pageTitle || `Dawnguide`
    const fullPageTitle = props.pageTitle ? `${props.pageTitle} - Dawnguide` : `Dawnguide`
    const pageDesc = props.pageDesc || "Flashcard practice of mindfulness, self-compassion and cognitive-behavioral therapy."
    const imageUrl = props.imageUrl || manifest('social-media-image.jpg')

    if (canonicalUrl && !canonicalUrl?.startsWith("http")) {
        canonicalUrl = absurl(canonicalUrl)
    }

    return <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{fullPageTitle}</title>
        {canonicalUrl ? <>
            <meta name="description" content={pageDesc} />
            <link rel="canonical" href={canonicalUrl} />
            {/* <link rel="alternate" type="application/atom+xml" href="/atom.xml" /> */}
            {/* <meta property="fb:app_id" content="1149943318300250" /> */}
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:title" content={pageTitle} />
            <meta property="og:description" content={pageDesc} />
            <meta property="og:image" content={imageUrl} />
            <meta property="og:site_name" content="Dawnguide" />
            <meta name="twitter:card" content="summary_large_image" />
            {/* <meta name="twitter:site" content="@DawnguideApp" />
            <meta name="twitter:creator" content="@DawnguideApp" /> */}
            <meta name="twitter:title" content={pageTitle} />
            <meta name="twitter:description" content={pageDesc} />
            <meta name="twitter:image" content={imageUrl} />
            {/* For now! */}
            <meta name="robots" content="noindex" />
        </> : <>
                <meta name="robots" content="noindex" />
            </>}

        <link rel="stylesheet" href={manifest('site.sass')} />
        {props.children}
    </head>
}
