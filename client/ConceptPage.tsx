import * as React from 'react'
import { useObserver } from 'mobx-react-lite'
const TimeAgo = require('react-timeago').default

import { Concept } from '../shared/sunpedia'
import { AppLayout } from './AppLayout'
import { Container } from 'react-bootstrap'
import { AppContext } from './AppContext'
import { getReviewTime } from '../shared/logic'

export function ConceptPage(props: { concept: Concept }) {
  const { store } = React.useContext(AppContext)
  const { concept } = props


  return useObserver(() => {
    const conceptProgress = store.conceptsWithProgressById[concept.id]

    return <AppLayout>
      <main className="ConceptPage">
        <Container>
          <h1>{concept.title}</h1>
          <p>{concept.introduction}</p>
          {conceptProgress && conceptProgress.progress && <div className="nextReview">
            <h3>Next Review</h3>
            <TimeAgo date={getReviewTime(conceptProgress.progress)} />
          </div>}
        </Container>
      </main>
    </AppLayout>
  })
}