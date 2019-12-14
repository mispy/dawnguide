import { BASE_URL } from "./settings"

export function redirect(dest: string, code: number = 302) {
    if (!dest.startsWith("http"))
        dest = BASE_URL + dest

    const res = Response.redirect(dest, code)
    return new Response(res.body, res)
}