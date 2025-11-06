import { it } from "vitest"

import { flattenObject } from "~/utils/flattener"

it("flattenObject", () => {
    flattenObject({ abc: [] })
})
