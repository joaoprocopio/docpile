import type { DefaultError, MutationKey, QueryKey, UseMutationOptions } from "@tanstack/vue-query"
import type { AnyFn } from "@vueuse/core"

export type TKeyring<
    TKind extends "query" | "mutation",
    TRoot extends string,
    TDefs extends Record<string, AnyFn> = Record<string, AnyFn>,
> = {
    all(): [TRoot]
} & {
    [TDef in keyof TDefs]: (
        ...args: Parameters<TDefs[TDef]>
    ) => TKind extends "query"
        ? { queryKey: [TRoot, ...QueryKey] } & ReturnType<TDefs[TDef]>
        : TKind extends "mutation"
          ? { mutationKey: [TRoot, ...MutationKey] } & ReturnType<TDefs[TDef]>
          : never
}

export function mutationOptions<
    TData = unknown,
    TError = DefaultError,
    TVariables = void,
    TContext = unknown,
>(options: UseMutationOptions<TData, TError, TVariables, TContext>) {
    return options
}

export { queryOptions } from "@tanstack/vue-query"
