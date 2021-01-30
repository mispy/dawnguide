import * as React from 'react'
import { Observer } from "mobx-react-lite"
import { Redirect } from "react-router-dom"
import { AppLayout } from "./AppLayout"
import { expectAuthed } from '../common/ProgressiveEnhancement'


export function NextLessonPage() {
    const { authed } = expectAuthed()

    function content() {
        if (!authed.lessonLessons.length) {
            // Nothing ready to learn
            return <Redirect to="/home" />
        } else {
            return <Redirect to={`/${authed.lessonLessons[0]!.slug}`} />
        }
    }

    return <Observer>{() => {
        return <AppLayout noHeader noFooter>
            {content()}
        </AppLayout>
    }}</Observer>
}