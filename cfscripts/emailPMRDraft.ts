import * as db from '../server/db'
import { runScript, StreamingTextResponse } from '../server/utils'
import { sendMail } from '../server/mail'
import { emailHtmlTemplate } from '../server/emailUtils'

const css = ``

const html = `Some stuff and things!

And other stuff?`

async function main(res: StreamingTextResponse) {
    const users = await db.users.all()

    for (const user of users) {
        if (user.email === "mispy@mispy.me") {
            const loginToken = await db.emailConfirmTokens.create(user.id, user.email)
            const resp = await sendMail({
                to: user.email,
                from: "Jaiden Mispy <mispy@dawnguide.com>",
                subject: "(Draft) Progressive muscle relaxation",
                html: emailHtmlTemplate(loginToken, html, css)
            })
            res.log(resp)
            res.log(user.email)
        }
    }

    res.close()
}

runScript(event => {
    const res = new StreamingTextResponse()
    event.waitUntil(main(res))
    event.respondWith(res)
})