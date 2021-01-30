import React = require('react')
import { useEffect, useContext } from 'react'
import { Observer } from 'mobx-react-lite'
import { SiteHeader } from '../common/SiteHeader'
import { ErrorModal } from './ErrorModal'
import { AppFooter } from './AppFooter'
import { expectAuthed } from '../common/ProgressiveEnhancement'

export function AppLayout(props: { title?: string, noHeader?: boolean, noFooter?: boolean, children: any }) {
    const noHeader = props.noHeader || false
    const noFooter = props.noFooter || false

    const { authed, errors } = expectAuthed()

    useEffect(() => {
        authed.loadProgress()
    }, [])

    if (props.title) {
        useEffect(() => {
            document.title = `${props.title} - Dawnguide`
            return () => { document.title = "Dawnguide" }
        }, [])
    }

    return <Observer>{() => <div className="AppLayout">
        {errors.unexpectedError ? <ErrorModal error={errors.unexpectedError} /> : undefined}
        <div className="fullScreen">
            {!noHeader ? <SiteHeader /> : undefined}
            <div>
                {props.children}
                {!noFooter ? <AppFooter /> : undefined}
            </div>
        </div>
    </div>}</Observer>
}