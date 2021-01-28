declare const require: any
const _ = require('lodash')

export async function delay(amount: number) {
    return new Promise(resolve => {
        _.delay(resolve, amount)
    })
}