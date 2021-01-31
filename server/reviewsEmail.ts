import type { User } from "../common/types"
import _ from 'lodash'
import * as db from './db'
import { sendMail } from "./mail"
import * as time from "../common/time"
import { absurl } from "../common/utils"
import { emailHtmlTemplate } from "./emailUtils"

export async function sendReviewsEmailIfNeeded(user: User) {
    const settings = await db.notificationSettings.get(user.id)
    if (settings.disableNotificationEmails || !settings.emailAboutWeeklyReviews)
        return // User doesn't want reviews email

    if (settings.lastWeeklyReviewEmail + time.weeks(1) > Date.now())
        return // Not yet time for weekly reviews email

    if (user.lastSeenAt <= settings.lastWeeklyReviewEmail - time.weeks(1))
        return // Don't keep sending emails if the user doesn't log in

    const plan = await db.makeLearnyPlanFor(user.id)
    const reviews = plan.availableReviews

    if (reviews.length === 0)
        return // No reviews to prompt about!

    await sendMail({
        to: user.email,
        subject: `You have ${reviews.length} cards ready to review on Dawnguide`,
        html: await reviewsEmailHtml(user, reviews.length)
    })

    await db.notificationSettings.update(user.id, { lastWeeklyReviewEmail: Date.now() })
}

export async function sendReviewsEmail(user: User) {
    const plan = await db.makeLearnyPlanFor(user.id)
    const reviews = plan.availableReviews

    await sendMail({
        to: user.email,
        subject: "Your Lessons and Reviews Update",
        html: await reviewsEmailHtml(user, reviews.length)
    })

    await db.notificationSettings.update(user.id, { lastWeeklyReviewEmail: Date.now() })
}

export async function reviewsEmailHtml(user: User, numReviews: number) {
    let linkSection = ''
    if (numReviews > 0) {
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