import http from './http'
import { SENDGRID_SECRET_KEY } from './settings'

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
        "personalizations": [
            { "to": [{ "email": msg.to }] }
        ],
        "from": { "email": msg.from || "Dawnguide <noreply@dawnguide.com>" },
        "subject": msg.subject
    }

    if ('html' in msg) {
        body.content = [{ "type": "text/html", "value": msg.html }]
    } else {
        body.content = [{ "type": "text/plain", "value": msg.text }]
    }

    await http.postJson("https://api.sendgrid.com/v3/mail/send", body, {
        headers: {
            Authorization: `Bearer ${SENDGRID_SECRET_KEY}`
        }
    })
}