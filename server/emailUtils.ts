import juice from 'juice'
import { absurl } from '../shared/utils'
import { APP_SECRET } from './settings'
import * as bcrypt from 'bcryptjs'

export function inlineCss(htmlWithStyles: string) {
    return juice(htmlWithStyles)
}

export function emailHtmlTemplate(loginToken: string, innerBody: string, style?: string) {
    return inlineCss(`
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title></title>
    <style>${style || ""}</style>
    </head>
    <body>
        <table style="min-width: 100%;">
            <tbody>
                <tr>
                    <td align="center" style="padding-top: 20px;">
                        <table style="width: 600px;">
                            <tbody>
                                <tr>
                                    <td>
                                        ${innerBody}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
        <table style="min-width: 100%;">
            <tbody>
                <tr>
                    <td align="center" style="padding-top: 20px;">
                        <table style="width: 600px;">
                            <tbody>
                                <tr>
                                    <td style="border-top: 1px solid #eeeeee; padding-top: 20px; color:#606060; font-size: 11px;">
                                        <em>Copyright &copy; 2020 Dawnlight Technology, All rights reserved.</em><br>
                                        <a href="${absurl(`/notifications?emailToken=${loginToken}`)}">Unsubscribe or update email settings</a>
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
`).trim()
}