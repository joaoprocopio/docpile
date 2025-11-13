export function hasOwnProperty<T extends object, K extends PropertyKey>(obj: T, key: K): boolean {
    return Object.prototype.hasOwnProperty.call(obj, key)
}
