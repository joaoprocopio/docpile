import { describe, expect, it } from "vitest"

import { isEmpty, isIndexBounded, isInteger, isNil, isPlainObject } from "~/utils/is"

describe("isPlainObject", () => {
    it("returns true for plain objects", () => {
        expect(isPlainObject({})).toBe(true)
        expect(isPlainObject({ foo: "bar" })).toBe(true)
        expect(isPlainObject({ foo: { bar: "baz" } })).toBe(true)
        expect(isPlainObject(new Object())).toBe(true)
        expect(isPlainObject(Object.create(Object.prototype))).toBe(true)
        expect(isPlainObject(new Proxy({}, {}))).toBe(true)
    })

    it("returns false for objects without prototype", () => {
        expect(isPlainObject(Object.create(null))).toBe(false)
    })

    it("returns false for arrays", () => {
        expect(isPlainObject([])).toBe(false)
        expect(isPlainObject([1, 2, 3])).toBe(false)
    })

    it("returns false for null and undefined", () => {
        expect(isPlainObject(null)).toBe(false)
        expect(isPlainObject(undefined)).toBe(false)
    })

    it("returns false for functions and class instances", () => {
        expect(isPlainObject(function () {})).toBe(false)
        expect(isPlainObject(() => {})).toBe(false)
        expect(isPlainObject(new Function())).toBe(false)

        // eslint-disable-next-line @typescript-eslint/no-extraneous-class
        class MyClass {}
        expect(isPlainObject(new MyClass())).toBe(false)
    })

    it("returns false for built-in objects", () => {
        expect(isPlainObject(new Date())).toBe(false)
        expect(isPlainObject(/abc/)).toBe(false)
        expect(isPlainObject(new Error())).toBe(false)
    })

    it("returns false for collections", () => {
        expect(isPlainObject(new Map())).toBe(false)
        expect(isPlainObject(new WeakMap())).toBe(false)
        expect(isPlainObject(new Set())).toBe(false)
        expect(isPlainObject(new WeakSet())).toBe(false)
    })

    it("returns false for typed arrays", () => {
        expect(isPlainObject(new Int8Array())).toBe(false)
        expect(isPlainObject(new Uint8Array())).toBe(false)
        expect(isPlainObject(new Float32Array())).toBe(false)
        expect(isPlainObject(new BigInt64Array())).toBe(false)
    })

    it("returns false for buffers and views", () => {
        expect(isPlainObject(new ArrayBuffer(8))).toBe(false)
        expect(isPlainObject(new SharedArrayBuffer(8))).toBe(false)
        expect(isPlainObject(new DataView(new ArrayBuffer(8)))).toBe(false)
    })

    it("returns false for promises and proxies of non-plain objects", () => {
        expect(isPlainObject(new Promise((resolve) => resolve))).toBe(false)
        expect(isPlainObject(new Proxy([1], {}))).toBe(false)
    })

    it("returns false for wrapper objects", () => {
        expect(isPlainObject(new Number(1))).toBe(false)
        expect(isPlainObject(new String("hi"))).toBe(false)
        expect(isPlainObject(new Boolean(true))).toBe(false)
        expect(isPlainObject(Object(1n))).toBe(false)
        expect(isPlainObject(Object(Symbol("x")))).toBe(false)
    })

    it("returns false for global objects", () => {
        expect(isPlainObject(Math)).toBe(false)
        expect(isPlainObject(Reflect)).toBe(false)
        expect(isPlainObject(JSON)).toBe(false)
        expect(isPlainObject(Atomics)).toBe(false)
        expect(isPlainObject(Intl)).toBe(false)
    })

    it("returns false for host objects in browser environments", () => {
        if (typeof window !== "undefined") {
            expect(isPlainObject(window)).toBe(false)
            expect(isPlainObject(document)).toBe(false)
        }
    })

    it("returns false for primitives", () => {
        expect(isPlainObject("string")).toBe(false)
        expect(isPlainObject(123)).toBe(false)
        expect(isPlainObject(true)).toBe(false)
        expect(isPlainObject(10n)).toBe(false)
        expect(isPlainObject(Symbol("x"))).toBe(false)
    })
})

describe("isNil", () => {
    it("returns true for null and undefined", () => {
        expect(isNil(null)).toBe(true)
        expect(isNil(undefined)).toBe(true)
    })

    it("returns false for all other values", () => {
        expect(isNil(0)).toBe(false)
        expect(isNil("")).toBe(false)
        expect(isNil(false)).toBe(false)
        expect(isNil([])).toBe(false)
        expect(isNil({})).toBe(false)
        expect(isNil(NaN)).toBe(false)
    })
})

describe("isIndexBounded", () => {
    it("returns true for valid indices", () => {
        const arr = [1, 2, 3, 4, 5]
        expect(isIndexBounded(arr, 0)).toBe(true)
        expect(isIndexBounded(arr, 2)).toBe(true)
        expect(isIndexBounded(arr, 4)).toBe(true)
    })

    it("returns false for negative indices", () => {
        const arr = [1, 2, 3]
        expect(isIndexBounded(arr, -1)).toBe(false)
        expect(isIndexBounded(arr, -5)).toBe(false)
    })

    it("returns false for indices at or beyond array length", () => {
        const arr = [1, 2, 3]
        expect(isIndexBounded(arr, 3)).toBe(false)
        expect(isIndexBounded(arr, 10)).toBe(false)
    })

    it("returns false for empty arrays", () => {
        expect(isIndexBounded([], 0)).toBe(false)
        expect(isIndexBounded([], 1)).toBe(false)
    })

    it("handles single-element arrays", () => {
        const arr = [42]
        expect(isIndexBounded(arr, 0)).toBe(true)
        expect(isIndexBounded(arr, 1)).toBe(false)
    })
})

describe("isInteger", () => {
    it("returns true for integer numbers", () => {
        expect(isInteger(0)).toBe(true)
        expect(isInteger(1)).toBe(true)
        expect(isInteger(-5)).toBe(true)
        expect(isInteger(100)).toBe(true)
    })

    it("returns true for integer strings", () => {
        expect(isInteger("0")).toBe(true)
        expect(isInteger("42")).toBe(true)
        expect(isInteger("-10")).toBe(true)
    })

    it("returns false for floating point numbers", () => {
        expect(isInteger(1.5)).toBe(false)
        expect(isInteger(-3.14)).toBe(false)
        expect(isInteger(0.1)).toBe(false)
    })

    it("returns false for floating point strings", () => {
        expect(isInteger("1.5")).toBe(false)
        expect(isInteger("3.14")).toBe(false)
    })

    it("returns false for non-numeric values", () => {
        expect(isInteger("abc")).toBe(false)
        expect(isInteger("")).toBe(false)
        expect(isInteger(null)).toBe(false)
        expect(isInteger(undefined)).toBe(false)
        expect(isInteger({})).toBe(false)
        expect(isInteger([])).toBe(false)
    })

    it("returns false for special numeric values", () => {
        expect(isInteger(NaN)).toBe(false)
        expect(isInteger(Infinity)).toBe(false)
        expect(isInteger(-Infinity)).toBe(false)
    })
})

describe("isEmpty", () => {
    it("returns true for null and undefined", () => {
        expect(isEmpty(null)).toBe(true)
        expect(isEmpty(undefined)).toBe(true)
    })

    it("returns true for empty arrays", () => {
        expect(isEmpty([])).toBe(true)
    })

    it("returns false for non-empty arrays", () => {
        expect(isEmpty([1])).toBe(false)
        expect(isEmpty([1, 2, 3])).toBe(false)
        expect(isEmpty([null])).toBe(false)
    })

    it("returns true for empty strings", () => {
        expect(isEmpty("")).toBe(true)
    })

    it("returns false for non-empty strings", () => {
        expect(isEmpty("hello")).toBe(false)
        expect(isEmpty(" ")).toBe(false)
        expect(isEmpty("0")).toBe(false)
    })

    it("returns true for empty Maps", () => {
        expect(isEmpty(new Map())).toBe(true)
    })

    it("returns false for non-empty Maps", () => {
        const map = new Map()
        map.set("key", "value")
        expect(isEmpty(map)).toBe(false)
    })

    it("returns true for empty Sets", () => {
        expect(isEmpty(new Set())).toBe(true)
    })

    it("returns false for non-empty Sets", () => {
        const set = new Set()
        set.add(1)
        expect(isEmpty(set)).toBe(false)
    })

    it("returns true for empty objects", () => {
        expect(isEmpty({})).toBe(true)
        expect(isEmpty(Object.create(null))).toBe(true)
    })

    it("returns false for non-empty objects", () => {
        expect(isEmpty({ a: 1 })).toBe(false)
        expect(isEmpty({ key: "value" })).toBe(false)
        expect(isEmpty({ a: undefined })).toBe(false)
    })

    it("returns true for objects with only inherited properties", () => {
        const parent = { inherited: true }
        const child = Object.create(parent)
        expect(isEmpty(child)).toBe(true)
    })

    it("returns false for primitives that are not nil", () => {
        expect(isEmpty(0)).toBe(false)
        expect(isEmpty(false)).toBe(false)
        expect(isEmpty(42)).toBe(false)
        expect(isEmpty(true)).toBe(false)
    })
})
