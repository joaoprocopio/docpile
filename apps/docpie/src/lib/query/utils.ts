/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DefaultError, MutationKey, QueryKey, UseMutationOptions } from "@tanstack/vue-query"

export function key<const TKey extends readonly unknown[]>(...args: TKey) {
    return args
}

export function defineKeyring<
    const TRootKey extends string,
    const TDefs extends Record<string, (...args: any[]) => any>,
>(
    defs: { all: () => readonly [TRootKey] } & {
        [TDef in keyof TDefs]: TDefs[TDef] extends (...args: infer TArgs) => infer TReturn
            ? TReturn extends { queryKey: readonly [...infer _] }
                ? (...args: TArgs) => Omit<TReturn, "queryKey"> & {
                      queryKey: readonly [TRootKey, ...QueryKey]
                  }
                : TReturn extends { mutationKey: readonly [...infer _] }
                  ? (...args: TArgs) => Omit<TReturn, "mutationKey"> & {
                        mutationKey: readonly [TRootKey, ...MutationKey]
                    }
                  : TDefs[TDef]
            : TDefs[TDef]
    },
) {
    return defs
}

export function mutationOptions<
    TData = unknown,
    TError = DefaultError,
    TVariables = void,
    TContext = unknown,
    TMutationKey = MutationKey,
>(
    options: UseMutationOptions<TData, TError, TVariables, TContext> & {
        mutationKey: TMutationKey
    },
) {
    return options
}

export { infiniteQueryOptions, queryOptions } from "@tanstack/vue-query"
