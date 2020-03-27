import React = require('react')
import { useEffect, useContext } from 'react'
import { AppContext } from './AppContext'
import { useObserver } from 'mobx-react-lite'
import { AppHeader } from './AppHeader'
import { ErrorModal } from './ErrorModal'

export function AppLayout(props: { children: any, noHeader?: boolean }) {
    const noHeader = props.noHeader || false

    const { store } = useContext(AppContext)

    useEffect(() => {
        store.loadProgress()
    }, [])

    return useObserver(() => <div className="AppLayout">
        {store.unexpectedError ? <ErrorModal error={store.unexpectedError} /> : undefined}
        {!noHeader ? <AppHeader /> : undefined}
        {props.children}
    </div>)
}