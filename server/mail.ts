import http from './http'
import { MAILGUN_SECRET, IS_TESTING, IS_PRODUCTION } from './settings'

type PlaintextEmailMessage = {
    to: string
    from?: string
    subject: string
    text: string
}

type HtmlEmailMessage = {
    to: string
    from?: string
    subject: string
    html: string
}

type EmailMessage = PlaintextEmailMessage | HtmlEmailMessage

export const testMailsSent: EmailMessage[] = []

export async function sendMail(msg: EmailMessage) {
    const body: any = {
        "to": msg.to,
        "from": msg.from || "Dawnguide <noreply@dawnguide.com>",
        "subject": msg.subject
    }

    if ('html' in msg) {
        body.html = msg.html
    } else {
        body.text = msg.text
    }

    if (IS_TESTING) {
        testMailsSent.push(msg)
    } else if (IS_PRODUCTION) {
        await http.post("https://api.mailgun.net/v3/dawnguide.com/messages", body, {
            headers: {
                Authorization: `Basic ${btoa(`api:${MAILGUN_SECRET}`)}`
            }
        })
    }
}