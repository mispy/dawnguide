import * as React from 'react'
import { useEffect } from 'react'
import { Observer } from 'mobx-react-lite'
import { SiteHeader } from '../common/SiteHeader'
import { ErrorModal } from './ErrorModal'
import { SiteFooter } from '../common/SiteFooter'
import { expectAuthed } from '../common/ProgressiveEnhancement'

export function AppLayout(props: { title?: string, noHeader?: boolean, noFooter?: boolean, children: any }) {
    const noHeader = props.noHeader || false
    const noFooter = props.noFooter || false

    const { errors } = expectAuthed()

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
                {!noFooter ? <SiteFooter /> : undefined}
            </div>
        </div>
    </div>}</Observer>
}