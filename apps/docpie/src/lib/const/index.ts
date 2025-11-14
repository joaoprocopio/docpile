export type EnumExtra = object

export type EnumKey = PropertyKey

export type Enum<K extends EnumKey, E extends EnumExtra = EnumExtra> = {
    [MK in K]: { value: MK } & E
}

export function asConst<K extends EnumKey, E extends EnumExtra = EnumExtra, const T = Enum<K, E>>(
    e: T,
): T {
    return e
}
