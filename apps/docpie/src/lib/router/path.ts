export function path(...segments: string[]) {
    return `/${segments.join("/")}`
}

export function dyn(name: string, suffix?: string) {
    return `:${name}${suffix}`
}
