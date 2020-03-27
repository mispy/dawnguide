import http from './http'
import { SENDGRID_SECRET_KEY } from './settings'

type EmailMessage = {
    to: string
    from?: string
    subject: string
    text: string
}

export async function sendMail(msg: EmailMessage): Promise<any> {
    const body = {
        "personalizations": [
            { "to": [{ "email": msg.to }] }
        ],
        "from": { "email": msg.from || "Sunpeep <sunpeep@example.com>" },
        "subject": msg.subject,
        "content": [{ "type": "text/plain", "value": msg.text }]
    }

    await http.postJson("https://api.sendgrid.com/v3/mail/send", body, {
        headers: {
            Authorization: `Bearer ${SENDGRID_SECRET_KEY}`
        }
    })
}