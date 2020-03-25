import * as React from 'react'

import parcelManifestDev = require('../client/tmp/parcel-manifest.json')
import parcelManifestProd = require('../client/dist/parcel-manifest.json')

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

export const Head = (props: { canonicalUrl: string, pageTitle?: string, pageDesc?: string, imageUrl?: string, children?: any }) => {
    const { canonicalUrl } = props
    const pageTitle = props.pageTitle || `Sunpeep`
    const fullPageTitle = props.pageTitle ? `${props.pageTitle} - Sunpeep` : `Sunpeep`
    const pageDesc = props.pageDesc || "Flashcard practice of mindfulness, self-compassion and cognitive-behavioral therapy."
    const imageUrl = props.imageUrl || manifest('social-media-image.jpg')

    // TODO canonicalUrl absolute if not http:// etc

    return <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{fullPageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={canonicalUrl} />
        {/* <link rel="alternate" type="application/atom+xml" href="/atom.xml" /> */}
        {/* <meta property="fb:app_id" content="1149943318300250" /> */}
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:site_name" content="Sunpeep" />
        <meta name="twitter:card" content="summary_large_image" />
        {/* <meta name="twitter:site" content="@sunpeep" />
        <meta name="twitter:creator" content="@sunpeep" /> */}
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image" content={imageUrl} />
        <link rel="stylesheet" href={manifest('landing.sass')} />
        {props.children}
    </head>
}
