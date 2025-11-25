/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DefaultError, MutationKey, UseMutationOptions } from "~/lib/cache"

export type Namespace = string
export type AnyFn = (...args: any[]) => any
export type Definition = Record<Namespace, AnyFn>

export type KeysDefinition<TNamespace extends Namespace, TDefinition extends Definition> = {
    [TDef in keyof TDefinition]: TDefinition[TDef] extends (...args: infer TArgs) => infer TReturn
        ? TReturn extends [...infer QK]
            ? (...args: TArgs) => readonly [TNamespace, ...QK]
            : never
        : never
}

export type QueriesDefinition<TNamespace extends Namespace, TDefinition extends Definition> = {
    [TDef in keyof TDefinition]: TDefinition[TDef] extends (...args: infer TArgs) => infer TReturn
        ? TReturn extends { queryKey: readonly [...infer QK] }
            ? (...args: TArgs) => TReturn & { queryKey: readonly [TNamespace, ...QK] }
            : never
        : never
}

export type MutationsDefinition<TNamespace extends Namespace, TDefinition extends Definition> = {
    [TDef in keyof TDefinition]: TDefinition[TDef] extends (...args: infer TArgs) => infer TReturn
        ? TReturn extends { mutationKey: readonly [...infer QK] }
            ? (...args: TArgs) => TReturn & { mutationKey: readonly [TNamespace, ...QK] }
            : never
        : never
}

export type KeyringDefinition<
    TNamespace extends Namespace,
    TQueryKeysDefinition extends Definition,
    TMutationKeysDefinition extends Definition,
    TQueriesDefinition extends Definition,
    TMutationsDefinition extends Definition,
> = {
    keys?: {
        queries?: KeysDefinition<TNamespace, TQueryKeysDefinition>
        mutations?: KeysDefinition<TNamespace, TMutationKeysDefinition>
    }
    queries?: QueriesDefinition<TNamespace, TQueriesDefinition>
    mutations?: MutationsDefinition<TNamespace, TMutationsDefinition>
}

export function defineCache<const TNamespace extends Namespace>(_: TNamespace) {
    return function <
        const TQueryKeysDefinition extends Definition,
        const TMutationKeysDefinition extends Definition,
        const TQueriesDefinition extends Definition,
        const TMutationsDefinition extends Definition,
        const TKeyringDefinition extends KeyringDefinition<
            TNamespace,
            TQueryKeysDefinition,
            TMutationKeysDefinition,
            TQueriesDefinition,
            TMutationsDefinition
        > = KeyringDefinition<
            TNamespace,
            TQueryKeysDefinition,
            TMutationKeysDefinition,
            TQueriesDefinition,
            TMutationsDefinition
        >,
    >(keyring: TKeyringDefinition) {
        return keyring
    }
}

export function key<const TKeys extends readonly unknown[]>(...args: TKeys) {
    return args
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
