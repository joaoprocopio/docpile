import { expect, it } from "vitest"

import { flattenObject } from "~/utils/obj"

it("flattenObject", () => {
    const obj = {
        address: {
            street: "123 Main St",
            coordinates: {
                lng: -74.006,
            },
        },
        hobbies: ["reading", "gaming"],
        metadata: {
            created: new Date("2024-01-01"),
            tags: {
                secondary: "active",
            },
        },
    }
    const flat = flattenObject(obj)

    expect(flat).toStrictEqual({
        "address.street": obj.address.street,
        "address.coordinates.lng": obj.address.coordinates.lng,
        "hobbies.0": obj.hobbies[0],
        "hobbies.1": obj.hobbies[1],
        "metadata.created": obj.metadata.created,
        "metadata.tags.secondary": obj.metadata.tags.secondary,
    })
})
