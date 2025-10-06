import { defineEventHandler } from "h3"

import { delay } from "~/utils/async"
import { randomInt } from "~/utils/random"

export default defineEventHandler(async () => {
    await delay(randomInt(50, 500))
})
