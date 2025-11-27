/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it } from "vitest"

import { flattenObject } from "~/utils/obj"

describe("flattenObject", () => {
    it("flattens nested objects", () => {
        const obj = {
            address: {
                street: "123 Main St",
                coordinates: {
                    lng: -74.006,
                },
            },
        }
        const flat = flattenObject(obj)

        expect(flat).toStrictEqual({
            "address.street": "123 Main St",
            "address.coordinates.lng": -74.006,
        })
    })

    it("flattens arrays with primitives", () => {
        const obj = { hobbies: ["reading", "gaming"] }
        const flat = flattenObject(obj)

        expect(flat).toStrictEqual({
            "hobbies.0": "reading",
            "hobbies.1": "gaming",
        })
    })

    it("flattens arrays with objects", () => {
        const obj = { items: [{ name: "item1" }, { name: "item2" }] }
        const flat = flattenObject(obj)

        expect(flat).toStrictEqual({
            "items.0.name": "item1",
            "items.1.name": "item2",
        })
    })

    it("handles mixed arrays with primitives and objects", () => {
        const obj = { data: ["text", { type: "music", level: 5 }] }
        const flat = flattenObject(obj)

        expect(flat).toStrictEqual({
            "data.0": "text",
            "data.1.type": "music",
            "data.1.level": 5,
        })
    })

    it("uses custom separator", () => {
        const obj = { a: { b: { c: 1 } } }
        const flat = flattenObject(obj, "_")

        expect(flat).toStrictEqual({ a_b_c: 1 })
    })

    it("handles empty objects", () => {
        expect(flattenObject({})).toStrictEqual({})
    })

    it("handles flat objects (no nesting)", () => {
        const obj = { a: 1, b: "text", c: true }
        const flat = flattenObject(obj)

        expect(flat).toStrictEqual({ a: 1, b: "text", c: true })
    })

    it("preserves null and undefined values", () => {
        const obj = { a: null, b: undefined, c: { d: null } }
        const flat = flattenObject(obj)

        expect(flat).toStrictEqual({
            "a": null,
            "b": undefined,
            "c.d": null,
        })
    })

    it("handles circular references without infinite loop", () => {
        const obj: any = { a: 1 }
        obj.self = obj

        const flat = flattenObject(obj)

        expect(flat).toStrictEqual({ a: 1 })
    })

    it("handles Date and other special objects as leaf values", () => {
        const date = new Date("2024-01-01")
        const obj = { created: date }
        const flat = flattenObject(obj)

        expect(flat).toStrictEqual({ created: date })
    })

    it("handles deeply nested structures", () => {
        const obj = { a: { b: { c: { d: { e: 1 } } } } }
        const flat = flattenObject(obj)

        expect(flat).toStrictEqual({ "a.b.c.d.e": 1 })
    })

    it("handles empty arrays", () => {
        const obj = { items: [] }
        const flat = flattenObject(obj)

        expect(flat).toStrictEqual({})
    })

    it("handles arrays nested in arrays via objects", () => {
        const obj = { data: [{ items: [1, 2] }] }
        const flat = flattenObject(obj)

        expect(flat).toStrictEqual({
            "data.0.items.0": 1,
            "data.0.items.1": 2,
        })
    })
})
