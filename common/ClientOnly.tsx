import _ from "lodash"
import React, { useEffect } from "react"

export function ClientOnly(props: { children: any }) {
    const [interactive, setInteractive] = React.useState(false)

    useEffect(() => {
        setInteractive(true)
    }, [])

    if (interactive) {
        return props.children
    } else {
        return null
    }
}