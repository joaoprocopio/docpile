type DeepMerge<A, B> = {
    [K in keyof A | keyof B]: K extends keyof B ? B[K] : K extends keyof A ? A[K] : never
}

export type EnumExtra = object

export type EnumKey = PropertyKey

export type Enum<K extends EnumKey, E extends EnumExtra = EnumExtra> = {
    [MK in K]: DeepMerge<{ value: MK }, E>
}

export function constEnum<
    const K extends EnumKey,
    const E extends EnumExtra = EnumExtra,
    const T extends Enum<K, E> = Enum<K, E>,
>(e: T): T {
    return e
}

export function asConst<const T>(v: T): T {
    return v
}
