import React, { useEffect } from "react"

export function useInteractivity() {
    const [interactive, setInteractive] = React.useState(false)

    useEffect(() => {
        setInteractive(true)
    }, [])

    return { interactive }
}