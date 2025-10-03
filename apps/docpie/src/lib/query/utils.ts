import type { DefaultError, MutationKey, QueryKey, UseMutationOptions } from "@tanstack/vue-query"

export type TKeyring<
    TKind extends "query" | "mutation",
    TRoot extends string,
    TDefs extends object = object,
> = {
    all(): [TRoot]
} & {
    [TDef in keyof TDefs]: TDefs[TDef] extends (...args: infer TArgs) => infer TReturnType
        ? (
              ...args: TArgs
          ) => TKind extends "query"
              ? { queryKey: [TRoot, ...QueryKey] } & TReturnType
              : TKind extends "mutation"
                ? { mutationKey: [TRoot, ...MutationKey] } & TReturnType
                : never
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
