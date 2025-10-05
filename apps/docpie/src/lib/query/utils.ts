/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DefaultError, UseMutationOptions, MutationKey } from "@tanstack/vue-query"

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
                      ? QK extends Array<unknown>
                          ? (...args: Args) => Return & { queryKey: [TRootKey, ...QK] }
                          : TFactory[K]
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
                      ? MK extends Array<unknown>
                          ? (...args: Args) => Return & { mutationKey: [TRootKey, ...MK] }
                          : TFactory[K]
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
>(options: UseMutationOptions<TData, TError, TVariables, TContext> & { mutationKey: MutationKey }) {
    return options
}

export { queryOptions, infiniteQueryOptions } from "@tanstack/vue-query"
