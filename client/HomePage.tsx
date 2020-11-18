import * as React from 'react'
import { useObserver } from "mobx-react-lite"
import { AppLayout } from "./AppLayout"
import { AppContext } from "./AppContext"
import * as _ from 'lodash'
import { Container } from "react-bootstrap"
import { Link } from "react-router-dom"
import { useContext } from "react"
import { showReviewTime } from "./LessonPage"
import { DebugTools } from "./DebugTools"
import { IS_PRODUCTION } from "./settings"
import { Lesson, content } from '../shared/content'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faBookReader, faCheckCircle, faHeart, faPen, faStar } from '@fortawesome/free-solid-svg-icons'
import { Learny, ReviewWithTime } from './AppStore'
import ReactTimeago from 'react-timeago'
import classNames from 'classnames'
import styled from 'styled-components'

function NextLessonCard(props: { lesson: Lesson | undefined }) {
    const { lesson } = props

    if (!lesson) {
        return <div className="NextLessonCard complete">
            <h4>All lessons complete! ⭐️</h4>
            <div>
                <p>When we write a new one, it'll be available here.</p>
            </div>
        </div>
    } else {
        return <Link to={`/${lesson.id}`} className="NextLessonCard">
            <h4>Next Lesson</h4>
            <div>
                <div className="summaryLine">
                    {lesson.summaryLine}
                </div>
                <h5>
                    {lesson.title} <FontAwesomeIcon icon={faArrowRight} />
                </h5>
            </div>
        </Link>
    }
}

function NextReviewCard(props: { reviews: ReviewWithTime[] }) {
    const { reviews } = props

    const Lessons = _.uniq(reviews.map(r => r.lesson))

    const now = Date.now()

    if (!reviews.length) {
        // TODO either no learned Lessons, or mastered all Lessons
        return <div>

        </div>
    } else if (reviews[0].when > now) {
        return <div className="NextReviewCard">
            <h4>You're up to date on reviews</h4>
            <div>
                <p>The next review is <ReactTimeago date={reviews[0].when} />.<br /><br />It will be about {Lessons[0].name}.</p>
            </div>
        </div>
    } else {

        let practiceLine
        if (Lessons.length === 1) {
            practiceLine = <>Refresh your understanding of {Lessons[0].name}</>
        } else if (Lessons.length === 2) {
            practiceLine = <>Refresh your understanding of {Lessons[0].name} and {Lessons[1].name}</>
        } else {
            practiceLine = <>Refresh your understanding of {Lessons[0].name}, {Lessons[1].name}, and more</>
        }

        return <Link to={`/review`} className="NextReviewCard">
            <h4>Next Review</h4>
            <div>
                <div className="summaryLine">
                    {practiceLine}
                </div>
                <h5>
                    Go to reviews <FontAwesomeIcon icon={faArrowRight} />
                </h5>
            </div>
        </Link>
    }
}

// export function HomePage() {
//     const { app } = useContext(AppContext)

//     return useObserver(() => <AppLayout>
//         <main className="HomePage">
//             {!app.loading && <Container className="mt-2">
//                 <div className="row mb-4">
//                     <div className="col-md-6 mt-2">
//                         <NextLessonCard lesson={app.nextLesson} />
//                     </div>
//                     <div className="col-md-6 mt-2">
//                         <NextReviewCard reviews={app.upcomingReviews} />
//                     </div>
//                 </div>
//                 {app.exercisesWithProgress.length ? <>
//                     <table className="table mt-4">
//                         <thead>
//                             <tr>
//                                 <th>Lesson</th>
//                                 <th>Exercise</th>
//                                 <th>Level</th>
//                                 <th>Next Review</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {app.exercisesWithProgress.map(item => <tr key={item.exercise.id}>
//                                 <td><Link className="text-link" to={`/${item.exercise.lessonId}`}>{content.lessonById[item.exercise.lessonId].title}</Link></td>
//                                 <td style={{ maxWidth: '300px' }}>{item.exercise.question}</td>
//                                 <td>{item.progress ? item.progress.level : 0}</td>
//                                 <td>{app.reviews.some(r => r.exercise.id === item.exercise.id) ? "Available now" : showReviewTime(item)}</td>
//                             </tr>)}
//                         </tbody>
//                     </table>
//                 </> : undefined}
//                 {!IS_PRODUCTION ? <DebugTools /> : undefined}
//             </Container>}
//         </main>
//     </AppLayout>)
// }

const MasteryProgressBarDiv = styled.div`
display: flex;
flex-direction: column;
color: #666;

.outer, .inner {
    border-radius: 10px;
}

.outer {
    width: 300px;
    height: 10px;
    background: rgba(33,36,44,0.08);
}

.inner {
    height: 100%;
    background: #9059ff;
}

.outer:not(.mastered) .inner {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
}
`

function MasteryProgressBar(props: { learny: Learny }) {
    const { learny } = props

    return <MasteryProgressBarDiv>
        <div className="d-flex">
            <div>
                {learny.masteryLevel === 9 && <FontAwesomeIcon icon={faStar} color="darkgold" />} Mastery level {learny.masteryLevel}/9
            </div>
        </div>

        <div className={classNames({ outer: true, mastered: learny.mastered })}>
            <div className="inner" style={{ width: `${learny.masteryPercent}%` }} />
        </div>
    </MasteryProgressBarDiv>
}

const Main = styled.main`
h2 {
    font-size: 1.7rem;
}

h2 > div {
    margin-top: 1rem;
    margin-bottom: 1rem;
    font-size: 1rem;
    font-weight: normal;
}

ul {
    padding: 0;
}

li {
    position: relative;
    list-style-type: none;
    display: flex;
    border-top: 1px solid #ccc;
    align-items: center;
}

li .intermarker {
    position: absolute;
    bottom: 0;
    left: 1.9rem;
    width: 2px;
    height: calc(100% + 1px);
    transform: translateX(-50%);
    background: #ccc;
    z-index: 1;
}

li:first-child .intermarker {
    height: calc(50% + 1px);
}

li:last-child .intermarker {
    height: calc(50% + 1px);
    top: -1px;
}

li.learned .intermarker {
    background: #008656;
}

li > a {
    padding: 1rem;
    display: flex;
}

li .marker {
    width: 1.8rem;
    height: 1.8rem;
    border: 1px solid rgba(33,36,44,0.50);
    margin-right: 1rem;
    position: relative;
    background: white;
    border-radius: 10%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    z-index: 2;

    .lessonType {
        color: #333;
        width: 0.8rem;
        height: 0.8rem;
    }

    .tick {
        position: absolute;
        top: 0;
        right: 0;
        transform: translate(50%, -50%);
        z-index: 1;
        background: white;
        width: 0.9rem;
    }
}

/* li.learned .marker {
    border - bottom: 1px solid #008656
} */

li.learned .fillbar {
            position: absolute;
    top: -1px;
    left: -1px;
    width: 1.8rem;
    height: 1.8rem;
    border-bottom: 5px solid #008656;
    border-radius: 10%;
}
`

export function HomePage() {
    const { app } = useContext(AppContext)

    const lessonIcons = {
        'reading': faBookReader,
        'writing': faPen,
        'meditation': faHeart
    }

    return useObserver(() => <AppLayout>
        <Main>
            {!app.loading && <Container className="mt-2">
                <div className="row mb-4">
                    <div className="col-md-6 mt-2">
                        <NextLessonCard lesson={app.nextLesson} />
                    </div>
                    <div className="col-md-6 mt-2">
                        <NextReviewCard reviews={app.upcomingReviews} />
                    </div>
                </div>
                {/* <h2>
                    Self-compassion
                    <div>Learn about being kind to yourself as well as those around you.</div>
                </h2> */}
                <ul>
                    {app.learnies.map(learny => <li key={learny.lesson.id} className={classNames({ lessonItem: true, learned: learny.learned })}>
                        <Link to={learny.lesson.id}>
                            <div className="intermarker"></div>
                            <div className="marker">
                                {learny.learned && <FontAwesomeIcon className="tick" icon={faCheckCircle} />}
                                <FontAwesomeIcon className="lessonType" icon={lessonIcons[learny.lesson.type]} />
                                {learny.learned && <div className="fillbar" />}
                            </div>
                            <div>{learny.lesson.title}</div>
                        </Link>
                        <div className="ml-auto">
                            {learny.learned && <MasteryProgressBar learny={learny} />}
                        </div>
                    </li>)}
                </ul>
                {!IS_PRODUCTION ? <DebugTools /> : undefined}
            </Container>}
        </Main>
    </AppLayout>)
}