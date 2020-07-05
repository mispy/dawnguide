
import { api } from './helpers'

describe('progress', () => {
    it('tests stuff', async () => {

        const res = await api.get("/")
        console.log(res)
    })
})