import { TEnum, TEnumKey } from "~/utils/enums"
import { isNil } from "~/utils/is"

export function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export function randomBool(): boolean {
    return Boolean((Math.random() + 0.5) >> 0)
}

export function randomArrayValue<T>(a: Array<T> | ReadonlyArray<T>): T | undefined {
    const i = a.length > 1 ? randomInt(0, a.length - 1) : 0

    return a.at(i)
}

export function randomEnumValue<T extends TEnumKey>(e: TEnum<TEnumKey, T>): T | undefined {
    const keys = Object.keys(e)
    const randomKey = randomArrayValue(keys)

    if (isNil(randomKey)) {
        return undefined
    }

    const randomValue = e[randomKey]

    return randomValue
}
