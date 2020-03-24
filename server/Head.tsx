import * as React from 'react'

export const Head = (props: { canonicalUrl: string, pageTitle?: string, pageDesc?: string, imageUrl?: string, children?: any }) => {
    const { canonicalUrl } = props
    const pageTitle = props.pageTitle || `Sunpeep`
    const fullPageTitle = props.pageTitle ? `${props.pageTitle} - Sunpeep` : `Sunpeep`
    const pageDesc = props.pageDesc || "Flashcard practice of mindfulness, self-compassion and cognitive-behavioral therapy."
    const imageUrl = props.imageUrl || `/social-media-image.jpg`

    // TODO canonicalUrl absolute if not http:// etc

    return <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{fullPageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="alternate" type="application/atom+xml" href="/atom.xml" />
        <meta property="fb:app_id" content="1149943818390250" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:site_name" content="Our World in Data" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@OurWorldInData" />
        <meta name="twitter:creator" content="@OurWorldInData" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image" content={imageUrl} />
        <link href="https://fonts.googleapis.com/css?family=Lato:300,400,400i,700,700i|Playfair+Display:400,700" rel="stylesheet" />
        {/* <link rel="stylesheet" href={webpack('commons.css', 'site')}/>
        <link rel="stylesheet" href={webpack('owid.css', 'site')}/> */}
        {props.children}
    </head>
}
