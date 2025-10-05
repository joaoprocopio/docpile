/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DefaultError, MutationKey, UseMutationOptions } from "@tanstack/vue-query"

export function defineQueries<
    const TRootKey extends string,
    const TDefs extends {
        [TDef in keyof TDefs]: TDef extends "all"
            ? () => [TRootKey] | readonly [TRootKey]
            : TDefs[TDef] extends (...args: infer TArgs) => infer TReturn
              ? TReturn extends { queryKey: infer QK }
                  ? QK extends any[]
                      ? (...args: TArgs) => TReturn & { queryKey: [TRootKey, ...QK] }
                      : TDefs[TDef]
                  : TDefs[TDef]
              : TDefs[TDef]
    },
>(__rootKey: TRootKey, defs: TDefs) {
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
