export type TEnumKey = PropertyKey

export type TEnum<GKey extends TEnumKey, GValue> = {
    [Key in GKey]: GValue
}
