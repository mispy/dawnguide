import { User } from "../common/types"
import * as _ from 'lodash'
import * as db from './db'
import { content } from "../common/content"
import { sendMail } from "./mail"
import { weeks } from "./time"
import { absurl } from "../common/utils"
import { emailHtmlTemplate } from "./emailUtils"

export async function sendReviewsEmailIfNeeded(user: User) {
    const settings = await db.notificationSettings.get(user.id)
    if (settings.disableNotificationEmails || !settings.emailAboutWeeklyReviews)
        return // User doesn't want reviews email

    if (settings.lastWeeklyReviewEmail + weeks(1) > Date.now())
        return // Not yet time for weekly reviews email

    if (user.lastSeenAt <= settings.lastWeeklyReviewEmail - weeks(1))
        return // Don't keep sending emails if the user doesn't log in

    const progressItems = await db.progressItems.allFor(user.id)
    const userLessons = await db.userLessons.byLessonId(user.id)

    const { lessons, reviews } = content.getLessonsAndReviews(userLessons, progressItems)

    if (reviews.length === 0)
        return // No reviews to prompt about!

    await sendMail({
        to: user.email,
        subject: "Your Lessons and Reviews Update",
        html: await reviewsEmailHtml(user, lessons.length, reviews.length)
    })

    await db.notificationSettings.update(user.id, { lastWeeklyReviewEmail: Date.now() })
}

export async function sendReviewsEmail(user: User) {
    const progressItems = await db.progressItems.allFor(user.id)
    const userLessons = await db.userLessons.byLessonId(user.id)
    const { lessons, reviews } = content.getLessonsAndReviews(userLessons, progressItems)

    await sendMail({
        to: user.email,
        subject: "Your Lessons and Reviews Update",
        html: await reviewsEmailHtml(user, lessons.length, reviews.length)
    })

    await db.notificationSettings.update(user.id, { lastWeeklyReviewEmail: Date.now() })
}

export async function reviewsEmailHtml(user: User, numLessons: number, numReviews: number) {
    let linkSection = ''
    if (numLessons > 0 && numReviews > 0) {
        linkSection = `
        you have <a href="${absurl('/review')}">${numReviews} reviews</a> to complete<br>
        and <a href="${absurl('/lesson')}">1 new lesson</a> available
`
    } else if (numLessons > 0) {
        linkSection = `
        you are up to date on reviews<br>
        and <a href="${absurl('/lesson')}">1 new lesson</a> is available
`
    } else if (numReviews > 0) {
        linkSection = `
        you have <a href="${absurl('/review')}">${numReviews} reviews</a> to complete<br>
`
    }

    const loginToken = await db.emailConfirmTokens.create(user.id, user.email)

    return emailHtmlTemplate(loginToken, `
        <table style="min-width: 100%;">
            <tbody>
                <tr>
                    <td style="text-align: center;">
                        <img alt="Pretty dawn image" src="${absurl('/lessons-and-reviews-email.jpg')}" width="340" height="256"/>
                    </td>
                </tr>
                <tr>
                    <td style="text-align: center; color: #333;">
                        <h1 style="font-size: 18px; font-weight: normal;">
                            Hi ${user.username}</span>,<br>
                            ${linkSection}
                        </h1>
                    </td>
                </tr>
            </tbody>
        </table>
`.trim())
}