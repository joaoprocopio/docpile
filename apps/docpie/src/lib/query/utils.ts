/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    type DefaultError,
    type QueryKey,
    queryOptions,
    type UseMutationOptions,
} from "@tanstack/vue-query"

export type TKey = string

type EnforceRootKey<TRootKey extends TKey, T extends object> = T & {
    queryKey: [TRootKey, ...QueryKey]
}

export type TQueries<
    TRootKey extends TKey,
    TKeyring extends Record<string, (...args: any) => { queryKey: any }>,
> = {
    all(): [TRootKey]
} & {
    [K in keyof TKeyring]: TKeyring[K] extends (...args: infer P) => infer R
        ? (...args: P) => EnforceRootKey<TRootKey, R>
        : never
}

export function defineQueries<
    TRootKey extends TKey,
    TKeyring extends Record<string, (...args: any[]) => { queryKey: [TRootKey, ...QueryKey] }>,
>(rootKey: TRootKey, keyring: TKeyring): TQueries<TRootKey, TKeyring> {
    return {
        all() {
            return [rootKey]
        },
        ...keyring,
    } as any
}

const users = defineQueries("users", {
    detail: (id: number) =>
        queryOptions({
            queryKey: ["users", "detail", id], // ✅ must start with "users"
            queryFn: () => Promise.resolve({ id, name: "João" }),
        }),

    list: () =>
        queryOptions({
            queryKey: ["users", "list"], // ✅ also must start with "users"
            queryFn: () => Promise.resolve([{ id: 1, name: "João" }]),
        }),
})

users.detail(123)

export function mutationOptions<
    TData = unknown,
    TError = DefaultError,
    TVariables = void,
    TContext = unknown,
>(options: UseMutationOptions<TData, TError, TVariables, TContext>) {
    return options
}

export { queryOptions } from "@tanstack/vue-query"
