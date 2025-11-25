/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DefaultError, MutationKey, UseMutationOptions } from "~/lib/cache"

export type AnyFn = (...args: any[]) => any
export type Definition = Record<string, AnyFn>

export type DefineKeys<TKey, TDefine> = {
    [TDef in keyof TDefine]: TDefine[TDef] extends (...args: infer TArgs) => infer TReturn
        ? TReturn extends [...infer QK]
            ? (...args: TArgs) => readonly [TKey, ...QK]
            : never
        : never
}

export type DefineKeyring<
    TKey extends string,
    TDefineQueryKeys extends Definition,
    TDefineMutationKeys extends Definition,
    // TDefineQueries extends Define,
    // TDefineMutations extends Define,
> = {
    keys: {
        queries: DefineKeys<TKey, TDefineQueryKeys>
        mutations: DefineKeys<TKey, TDefineMutationKeys>
    }
    // queries: null
    // mutations: null
}

export function defineKeyring<const TKey extends string>(_: TKey) {
    return function <
        const TDefineQueryKeys extends Definition,
        const TDefineMutationKeys extends Definition,
        const TKeyring extends DefineKeyring<
            TKey,
            TDefineQueryKeys,
            TDefineMutationKeys
        > = DefineKeyring<TKey, TDefineQueryKeys, TDefineMutationKeys>,
    >(keyring: TKeyring) {
        return keyring
    }
}

export function key<const TKey extends readonly unknown[]>(...args: TKey) {
    return args
}

const cache = defineKeyring("auth")({
    keys: {
        queries: {
            all: () => key("auth", { abc: 123 }),
        },
        mutations: {
            all: () => key("auth", 123),
        },
    },
})

cache.keys.queries.all()
cache.keys.mutations.all()

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
