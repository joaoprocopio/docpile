/* eslint-disable @typescript-eslint/no-explicit-any */
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

export function constEnumToValues<
    const K extends EnumKey,
    const E extends EnumExtra = EnumExtra,
    const T extends Enum<K, E> = Enum<K, E>,
>(e: T): T[keyof T]["value"][] {
    return Object.values(e).map((item: any) => item.value)
}

export function asConst<const T>(v: T): T {
    return v
}
