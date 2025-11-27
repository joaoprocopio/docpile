export function path(...segments: string[]) {
    return `/${segments.join("/")}`
}

export function dyn(name: string) {
    return `:${name}`
}
