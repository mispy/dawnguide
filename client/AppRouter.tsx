import React = require('react')
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom"
import { useContext } from 'react'

import { HomePage } from "./HomePage"
import { LessonPage } from "./LessonPage"
import { ReviewPage } from "./ReviewPage"
import { SubscriptionPage } from "./SubscriptionPage"
import { ConceptPage } from './ConceptPage'
import { AppContext } from './AppContext'

export function AppRouter() {
  const { sunpedia } = useContext(AppContext)

  return <Router>
    <Switch>
      <Route path="/home">
        <HomePage />
      </Route>
      <Route path="/lesson">
        <LessonPage />
      </Route>
      <Route path="/review">
        <ReviewPage />
      </Route>
      <Route path="/account/subscribe">
        <SubscriptionPage />
      </Route>
      {sunpedia.concepts.map(concept =>
        <Route key={concept.id} path={`/concept/${concept.id}`}>
          <ConceptPage concept={concept} />
        </Route>
      )}
      {/* TODO 404 */}
    </Switch>
  </Router>
}