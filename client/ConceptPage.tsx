import * as React from 'react'
import { Concept } from '../shared/concepts'
import { AppLayout } from './AppLayout'

export function ConceptPage(props: { concept: Concept }) {
    const { concept } = props

    return <AppLayout>
        {concept.title}
    </AppLayout>
}