import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { observer } from 'mobx-react-lite'
import * as _ from 'lodash'

import './app.sass'
import { AppRouter } from './AppRouter'
import { SunpeepApi } from './SunpeepApi'
import { AppContext } from './AppContext'
import { AppStore } from './AppStore'
import { useMemo } from 'react'

function App() {
  const context = useMemo(() => {
    const store = new AppStore()

    return {
      store: store,
      api: store.api,
      sunpedia: store.sunpedia
    }
  }, [])

  _.extend(window, context)

  return <AppContext.Provider value={context}>
    <AppRouter />
  </AppContext.Provider>
}

ReactDOM.render(<App />, document.getElementById("root"))

declare const module: any
if (module.hot) {
  module.hot.accept()
}