import http from './http'
import { SENDGRID_SECRET_KEY, MAILGUN_SECRET } from './settings'

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

    await http.post("https://api.mailgun.net/v3/dawnguide.com/messages", body, {
        headers: {
            Authorization: `Basic ${btoa(`api:${MAILGUN_SECRET}`)}`
        }
    })
}