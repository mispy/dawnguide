export type Json = { [key: string]: string | number | Json | null | undefined }

/** Expect a given json object to resolve some keys to string values */
export function expectStrings<U extends keyof Json>(json: Json, ...keys: U[]): Pick<{ [key: string]: string }, U> {
    const obj: any = {}
    for (const key of keys) {
        const val = json[key]
        if (!_.isString(val)) {
            throw new Error(`Expected string value for ${key} in object ${JSON.stringify(json)}`)
        }
        obj[key] = val
    }
    return obj
}