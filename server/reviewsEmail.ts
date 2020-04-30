import { User } from "../shared/types"
import _ = require("lodash")
import { BASE_URL } from './settings'
import db = require('./db')
import { Sunpedia } from "../shared/sunpedia"
import { sendMail } from "./mail"
import { weeks } from "./time"

export async function sendReviewsEmailIfNeeded(user: User) {
    const settings = await db.notificationSettings.get(user.id)
    if (settings.disableNotificationEmails || !settings.emailAboutWeeklyReviews)
        return // User doesn't want reviews email

    if (settings.lastWeeklyReviewEmail + weeks(1) > Date.now())
        return // Not yet time for weekly reviews email

    const sunpedia = new Sunpedia()
    const progressItems = await db.progressItems.allFor(user.id)
    const { lessons, reviews } = sunpedia.getLessonsAndReviews(progressItems)

    if (lessons.length === 0 && reviews.length === 0)
        return // Nothing to prompt user about!

    console.log(`SENDING WEEKLY REVIEWS EMAIL TO ${user.email}`)

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
        you have <a href="${BASE_URL}/review">${numReviews} reviews</a> to complete<br>
        and <a href="${BASE_URL}/lesson">1 new lesson</a> available
`
    } else if (numLessons > 0) {
        linkSection = `
        you are up to date on reviews<br>
        and <a href="${BASE_URL}/lesson">1 new lesson</a> is available
`
    } else if (numReviews > 0) {
        linkSection = `
        you have <a href="${BASE_URL}/review">${numReviews} reviews</a> to complete<br>
`
    }

    return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="x-apple-disable-message-reformatting" />
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title></title>
      </head>
      <body style="width: 100% !important; background-color: #FFF; color: #333; margin: 0;" bgcolor="#FFF">
        <table style="min-width: 100%;">
            <tbody>
                <tr>
                    <td style="text-align: center;">
                        <img alt="Pretty dawn image" src="${BASE_URL}/lessons-and-reviews-email.jpg" width="340" height="256"/>
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
                <tr>
                    <td align="center" style="padding-top: 20px;">
                        <table style="width: 600px;">
                            <tbody>
                                <tr>
                                    <td style="border-top: 1px solid #eeeeee; padding-top: 20px; color:#606060; font-size: 11px;">
                                        <em>Copyright &copy; 2020 Dawnlight Technology, All rights reserved.</em><br>
                                        <a href="${BASE_URL}/settings#notifications">Unsubcribe or update email settings</a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
      </body>
    </html>
`
}