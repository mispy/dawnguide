import * as React from 'react'
import { Observer } from "mobx-react-lite"
import { AppContext } from "./AppContext"
import { Redirect } from "react-router-dom"
import { AppLayout } from "./AppLayout"
import { useContext } from "react"


export function NextLessonPage() {
    const { app } = useContext(AppContext)

    function content() {
        if (!app.lessonLessons.length) {
            // Nothing ready to learn
            return <Redirect to="/home" />
        } else {
            return <Redirect to={`/${app.lessonLessons[0]!.slug}`} />
        }
    }

    return <Observer>{() => {
        return <AppLayout noHeader noFooter>
            {content()}
        </AppLayout>
    }}</Observer>
}