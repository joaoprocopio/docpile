/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DefaultError, MutationKey, UseMutationOptions } from "~/lib/cache"

export type AnyFn = (...args: any[]) => any
export type Definition = Record<string, AnyFn>

export type KeysDefinition<TNamespace, TDefinition> = {
    [TDef in keyof TDefinition]: TDefinition[TDef] extends (...args: infer TArgs) => infer TReturn
        ? TReturn extends [...infer QK]
            ? (...args: TArgs) => readonly [TNamespace, ...QK]
            : never
        : never
}

export type KeyringDefinition<
    TNamespace extends string,
    TQueryKeysDefinition extends Definition,
    TMutationKeysDefinition extends Definition,
    // TQueriesDefinition extends Definition,
    // TMutationsDefinition extends Definition,
> = {
    keys: {
        queries: KeysDefinition<TNamespace, TQueryKeysDefinition>
        mutations: KeysDefinition<TNamespace, TMutationKeysDefinition>
    }
    // queries: null
    // mutations: null
}

export function defineKeyring<const TNamespace extends string>(_: TNamespace) {
    return function <
        const TQueryKeysDefinition extends Definition,
        const TMutationKeysDefinition extends Definition,
        const TKeyringDefinition extends KeyringDefinition<
            TNamespace,
            TQueryKeysDefinition,
            TMutationKeysDefinition
        > = KeyringDefinition<TNamespace, TQueryKeysDefinition, TMutationKeysDefinition>,
    >(keyring: TKeyringDefinition) {
        return keyring
    }
}

export function key<const TKeys extends readonly unknown[]>(...args: TKeys) {
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
