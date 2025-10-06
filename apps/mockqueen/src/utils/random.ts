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
