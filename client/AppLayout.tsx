import React = require('react')
import { useEffect, useContext } from 'react'
import { AppContext } from './AppContext'
import { useObserver } from 'mobx-react-lite'
import { AppHeader } from './AppHeader'
import { ErrorModal } from './ErrorModal'
import { SiteFooter } from '../server/SiteFooter'

export function AppLayout(props: { children: any, noHeader?: boolean, noFooter?: boolean }) {
    const noHeader = props.noHeader || false
    const noFooter = props.noFooter || false

    const { app } = useContext(AppContext)

    useEffect(() => {
        app.loadProgress()
    }, [])

    return useObserver(() => <div className="AppLayout">
        {app.unexpectedError ? <ErrorModal error={app.unexpectedError} /> : undefined}
        {!noHeader ? <AppHeader /> : undefined}
        {props.children}
        {!noFooter ? <SiteFooter /> : undefined}
    </div>)
}