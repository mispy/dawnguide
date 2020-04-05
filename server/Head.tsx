import * as React from 'react'

import { absurl } from './utils'

export const Head = (props: { canonicalUrl: string | null, pageTitle?: string, pageDesc?: string, imageUrl?: string, children?: any, cssUrl?: string }) => {
    let { canonicalUrl } = props
    const pageTitle = props.pageTitle || `Dawnguide`
    const fullPageTitle = props.pageTitle ? `${props.pageTitle} - Dawnguide` : `Dawnguide`
    const pageDesc = props.pageDesc || "Flashcard practice of mindfulness, self-compassion and cognitive-behavioral therapy."
    const imageUrl = props.imageUrl || '/social-media-image.jpg'
    const cssUrl = props.cssUrl || "/site.css"

    if (canonicalUrl && !canonicalUrl?.startsWith("http")) {
        canonicalUrl = absurl(canonicalUrl)
    }

    const script = `if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
          navigator.serviceWorker.register('/serviceWorker.js').then(function(registration) {
            // Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
          }, function(err) {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', err);
          });
        });
      }`

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
            {/* <meta name="robots" content="noindex" /> */}
            <link rel="manifest" href="/manifest.webmanifest" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="black" />
            <meta name="apple-mobile-web-app-title" content="Dawnguide" />
            <link rel="apple-touch-icon" href="/icon-152x152.png"></link>
            <meta name="theme-color" content="#ef98a8" />

        </> : <>
                <meta name="robots" content="noindex" />
            </>}

        <link rel="stylesheet" href={cssUrl} />
        {props.children}
        {/* <script dangerouslySetInnerHTML={{ __html: script }} /> */}
    </head>
}
