import { expect, it } from "vitest"

import { isPlainObject } from "~/utils/is"

it("isPlainObject", () => {
    // ✅ Plain objects
    expect(isPlainObject({})).toBe(true)
    expect(isPlainObject({ foo: "bar" })).toBe(true)
    expect(isPlainObject({ foo: { bar: "baz" } })).toBe(true)
    expect(isPlainObject(new Object())).toBe(true)
    expect(isPlainObject(Object.create(Object.prototype))).toBe(true)
    expect(isPlainObject(new Proxy({}, {}))).toBe(true)

    // 🚫 Non-plain objects
    expect(isPlainObject(Object.create(null))).toBe(false) // no prototype

    // Arrays
    expect(isPlainObject([])).toBe(false)
    expect(isPlainObject([1, 2, 3])).toBe(false)
    expect(isPlainObject([])).toBe(false)

    // Null / undefined
    expect(isPlainObject(null)).toBe(false)
    expect(isPlainObject(undefined)).toBe(false)

    // Functions
    expect(isPlainObject(function () {})).toBe(false)
    expect(isPlainObject(() => {})).toBe(false)
    expect(isPlainObject(new Function())).toBe(false)
    // eslint-disable-next-line @typescript-eslint/no-extraneous-class
    class MyClass {}
    expect(isPlainObject(new MyClass())).toBe(false)

    // Built-ins
    expect(isPlainObject(new Date())).toBe(false)
    expect(isPlainObject(/abc/)).toBe(false)
    expect(isPlainObject(new Error())).toBe(false)

    // Collections
    expect(isPlainObject(new Map())).toBe(false)
    expect(isPlainObject(new WeakMap())).toBe(false)
    expect(isPlainObject(new Set())).toBe(false)
    expect(isPlainObject(new WeakSet())).toBe(false)

    // Typed Arrays
    expect(isPlainObject(new Int8Array())).toBe(false)
    expect(isPlainObject(new Uint8Array())).toBe(false)
    expect(isPlainObject(new Float32Array())).toBe(false)
    expect(isPlainObject(new BigInt64Array())).toBe(false)

    // Buffers and Views
    expect(isPlainObject(new ArrayBuffer(8))).toBe(false)
    expect(isPlainObject(new SharedArrayBuffer(8))).toBe(false)
    expect(isPlainObject(new DataView(new ArrayBuffer(8)))).toBe(false)

    // Promise / Proxy
    expect(isPlainObject(new Promise((resolve) => resolve))).toBe(false)
    expect(isPlainObject(new Proxy([1], {}))).toBe(false)

    // Wrapper objects
    expect(isPlainObject(new Number(1))).toBe(false)
    expect(isPlainObject(new String("hi"))).toBe(false)
    expect(isPlainObject(new Boolean(true))).toBe(false)
    expect(isPlainObject(Object(1n))).toBe(false)
    expect(isPlainObject(Object(Symbol("x")))).toBe(false)

    // Globals
    expect(isPlainObject(Math)).toBe(false)
    expect(isPlainObject(Reflect)).toBe(false)
    expect(isPlainObject(JSON)).toBe(false)
    expect(isPlainObject(Atomics)).toBe(false)
    expect(isPlainObject(Intl)).toBe(false)

    // Host objects (skip in non-browser environments)
    if (typeof window !== "undefined") {
        expect(isPlainObject(window)).toBe(false)
        expect(isPlainObject(document)).toBe(false)
    }

    // Primitives
    expect(isPlainObject("string")).toBe(false)
    expect(isPlainObject(123)).toBe(false)
    expect(isPlainObject(true)).toBe(false)
    expect(isPlainObject(10n)).toBe(false)
    expect(isPlainObject(Symbol("x"))).toBe(false)
})
