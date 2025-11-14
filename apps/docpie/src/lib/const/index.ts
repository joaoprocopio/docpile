export type TConstEnumExtraData = object

export type TConstEnumKey = PropertyKey

export type TConstEnum<
    GKey extends TConstEnumKey,
    GExtraData extends TConstEnumExtraData = TConstEnumExtraData,
> = {
    [GMappedKey in GKey]: { value: GMappedKey } & GExtraData
}

export function asConst<
    GKey extends TConstEnumKey,
    GExtraData extends TConstEnumExtraData = TConstEnumExtraData,
    const GEnum = TConstEnum<GKey, GExtraData>,
>(e: GEnum): GEnum {
    return e
}
