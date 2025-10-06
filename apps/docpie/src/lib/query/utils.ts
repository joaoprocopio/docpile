/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DefaultError, MutationKey, QueryKey, UseMutationOptions } from "@tanstack/vue-query"

export function defineQueries<
    const TRootKey extends string,
    const TDefs extends Record<string, (...args: any[]) => any>,
>(
    _: TRootKey,
    defs: {
        [TDef in keyof TDefs]: TDef extends "all"
            ? () => [TRootKey] | readonly [TRootKey]
            : TDefs[TDef] extends (...args: infer TArgs) => infer TReturn
              ? TReturn extends { queryKey: [...infer _] | readonly [...infer _] }
                  ? (...args: TArgs) => Omit<TReturn, "queryKey"> & {
                        queryKey: readonly [TRootKey, ...QueryKey]
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
>(options: UseMutationOptions<TData, TError, TVariables, TContext> & { mutationKey: MutationKey }) {
    return options
}

export { infiniteQueryOptions, queryOptions } from "@tanstack/vue-query"
