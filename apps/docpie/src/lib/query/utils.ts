/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DefaultError, QueryKey, UseMutationOptions } from "@tanstack/vue-query"

export type TKey = string

export type TQueries<TRootKey extends TKey, TKeys extends TKey> = {
    all(): [TRootKey]
} & {
    [K in TKeys]: (...args: any[]) => {
        queryKey: [TRootKey, ...QueryKey]
    }
}
export function defineQueries<TRootKey extends TKey, TKeys extends TKey>(
    rootKey: TRootKey,
    keyring: Record<TKeys, any>,
): TQueries<TRootKey, TKeys> {
    return {
        all() {
            return [rootKey]
        },
        ...keyring,
    }
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
