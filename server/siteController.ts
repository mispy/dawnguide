import { pageResponse } from "./utils"
import { LandingPage } from "./LandingPage"
import { EventRequest, SessionRequest } from "./requests"
import { Sunpedia } from "../shared/sunpedia"
import { ConceptPage } from "./ConceptPage"
import * as _ from 'lodash'
import { AppPage } from "./AppPage"
import * as db from './db'

export async function landingPage() {
    return pageResponse(LandingPage)
}

export async function appPage(req: SessionRequest) {
    const user = _.omit(await db.users.expect(req.session.userId), 'cryptedPassword')
    return pageResponse(AppPage, { user: user })
}

export async function conceptPage(req: EventRequest, conceptId: string) {
    const sunpedia = new Sunpedia()

    const concept = sunpedia.getConcept(conceptId)

    if (!concept) {
        return new Response(`Unknown concept ${conceptId}`, { status: 404 })
    }

    return pageResponse(ConceptPage, { concept: concept })
}