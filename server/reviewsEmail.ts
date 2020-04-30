import { User } from "../shared/types"
import _ = require("lodash")
import { BASE_URL } from './settings'

export async function reviewsEmailHtml(user: User) {
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
                            you have <a href="${BASE_URL}/review">3 reviews</a> to complete<br>
                            and <a href="${BASE_URL}/lesson">1 new lesson</a> available
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