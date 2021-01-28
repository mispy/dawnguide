import * as React from 'react'
import * as ReactDOM from 'react-dom'

import './app.sass'
import { AppRouter } from './AppRouter'
import { AppContext } from './AppContext'
import { AppStore } from './AppStore'
import { useMemo } from 'react'
import type { User, UserProgress } from '../common/types'
import { CanvasEffects } from './CanvasEffects'
import { content } from '../common/content'
import { LessonView } from '../common/LessonView'

// These props come from AppPage on the server
function App(props: { user: User, progress: UserProgress }) {
    const context = useMemo(() => {
        const app = new AppStore(props.user, props.progress)

        return {
            app: app,
            api: app.api,
            user: app.user,
            effects: new CanvasEffects()
        }
    }, [])

    return <AppContext.Provider value={context}>
        <AppRouter />
    </AppContext.Provider>
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
    ReactDOM.hydrate(<LessonView lesson={lesson} />, document.getElementsByClassName('lessonContainer')[0])
}
