import { it } from "vitest"

import { flattenObject } from "~/utils/flattener"

it("flattenObject", () => {
    const res = flattenObject({
        name: "John",
        age: 30,
        address: {
            street: "123 Main St",
            city: "New York",
            coordinates: {
                lat: 40.7128,
                lng: -74.006,
            },
        },
        hobbies: ["reading", "gaming"],
        metadata: {
            created: new Date("2024-01-01"),
            tags: {
                primary: "user",
                secondary: "active",
            },
        },
    })
    console.log(res)
})
