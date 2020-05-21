import React = require('react')
import { useEffect, useContext } from 'react'
import { AppContext } from './AppContext'
import { useObserver } from 'mobx-react-lite'
import { AppHeader } from './AppHeader'
import { ErrorModal } from './ErrorModal'
import { AppFooter } from './AppFooter'

export function AppLayout(props: { title?: string, noHeader?: boolean, noFooter?: boolean, children: any }) {
    const noHeader = props.noHeader || false
    const noFooter = props.noFooter || false

    const { app } = useContext(AppContext)

    useEffect(() => {
        app.loadProgress()
    }, [])

    if (props.title) {
        useEffect(() => {
            document.title = `${props.title} - Dawnguide`
            return () => { document.title = "Dawnguide" }
        }, [])
    }

    return useObserver(() => <div className="AppLayout">
        {app.unexpectedError ? <ErrorModal error={app.unexpectedError} /> : undefined}
        <div className="fullScreen">
            {!noHeader ? <AppHeader /> : undefined}
            {props.children}
        </div>
        {!noFooter ? <AppFooter /> : undefined}
    </div>)
}