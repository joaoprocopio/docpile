import { defineEventHandler } from "h3"

import { delay } from "~/utils/async"
import { randomInt } from "~/utils/random"

const BASE_DELAY = 15

export default defineEventHandler(async () => {
    await delay(randomInt(BASE_DELAY, BASE_DELAY * 100))
})
