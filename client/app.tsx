import * as React from 'react'
import * as ReactDOM from 'react-dom'

import './authed.sass'
import { AppRouter } from './AppRouter'
import { BrowserContextProvider } from './BrowserContext'
import { useMemo } from 'react'
import type { User, UserProgress } from '../common/types'
import { content } from '../common/content'
import { LessonView } from '../common/LessonView'
import { AuthedState } from './AuthedState'
import { SiteHeader } from '../common/SiteHeader'

// These props come from AppPage on the server
function App(props: { user: User, progress: UserProgress }) {
    const context = useMemo(() => {
        const authed = new AuthedState(props.user, props.progress)

        return {
            authed: authed
        }
    }, [])

    return <BrowserContextProvider authed={context.authed}>
        <AppRouter />
    </BrowserContextProvider>
}

declare const module: any
if (module.hot) {
    module.hot.accept()
}

declare const window: any
window.initApp = (props: { user: User, progress: UserProgress }) => {
    ReactDOM.render(<App {...props} />, document.getElementById("root"))
}

window.hydrateLesson = function (lessonId: string) {
    const lesson = content.expectLesson(lessonId)
    // @ts-ignore
    ReactDOM.hydrate(<BrowserContextProvider><LessonView lesson={lesson} /></BrowserContextProvider>, document.getElementsByClassName('lessonContainer')[0])
    // @ts-ignore
    ReactDOM.hydrate(<BrowserContextProvider><SiteHeader /></BrowserContextProvider>, document.getElementsByClassName('headerContainer')[0])
}