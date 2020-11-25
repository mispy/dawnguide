
import { matchesAnswerPermissively } from '../common/logic'

describe('logic', () => {
    it('tolerates typos but not too much', async () => {
        expect(matchesAnswerPermissively("wafflez", "waffles")).toBe(true)
        expect(matchesAnswerPermissively("wafflezzz", "waffles")).toBe(false)
    })
})