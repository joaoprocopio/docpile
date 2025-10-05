/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DefaultError, MutationKey, QueryKey, UseMutationOptions } from "@tanstack/vue-query"

type ValidateQueryKey<TRootKey extends string, TKey> = TKey extends readonly [
    infer First,
    ...infer Rest,
]
    ? First extends TRootKey
        ? readonly [TRootKey, ...Rest]
        : { _error: `Key must start with "${TRootKey}", got "${First & string}"` }
    : { _error: `Key must be an array starting with "${TRootKey}"` }

type ValidateMutationKey<TRootKey extends string, TKey> = TKey extends readonly [
    infer First,
    ...infer Rest,
]
    ? First extends TRootKey
        ? readonly [TRootKey, ...Rest]
        : { _error: `Key must start with "${TRootKey}", got "${First & string}"` }
    : { _error: `Key must be an array starting with "${TRootKey}"` }

export function defineQueries<TRootKey extends string>() {
    return <
        const TFactory extends {
            all: () => [TRootKey]
            [K: string]: (...args: any[]) => any
        },
    >(
        factory: TFactory & {
            [K in keyof TFactory]: K extends "all"
                ? () => [TRootKey]
                : TFactory[K] extends (...args: infer Args) => infer Return
                  ? Return extends { queryKey: infer QK }
                      ? (...args: Args) => Return & { queryKey: ValidateQueryKey<TRootKey, QK> }
                      : TFactory[K]
                  : TFactory[K]
        },
    ): TFactory => factory
}

export function defineMutations<TRootKey extends string>() {
    return <
        const TFactory extends {
            all: () => [TRootKey]
            [K: string]: (...args: any[]) => any
        },
    >(
        factory: TFactory & {
            [K in keyof TFactory]: K extends "all"
                ? () => [TRootKey]
                : TFactory[K] extends (...args: infer Args) => infer Return
                  ? Return extends { mutationKey: infer MK }
                      ? (...args: Args) => Return & { mutationKey: ValidateMutationKey<TRootKey, MK> }
                      : TFactory[K]
                  : TFactory[K]
        },
    ): TFactory => factory
}

export function mutationOptions<
    TData = unknown,
    TError = DefaultError,
    TVariables = void,
    TContext = unknown,
>(options: UseMutationOptions<TData, TError, TVariables, TContext>) {
    return options
}

export { queryOptions, infiniteQueryOptions } from "@tanstack/vue-query"
