/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DefaultError, QueryKey, UseMutationOptions } from "@tanstack/vue-query"

export type TKey = string

export type TKind = "query" | "mutation"

export type TDefs<
    TKindIn extends TKind,
    TRootKey extends TKey,
    TParams extends unknown[],
    TReturnType,
> = (
    ...args: TParams
) => TKindIn extends "query"
    ? { queryKey: [TRootKey, ...QueryKey] } & TReturnType
    : { mutationKey: [TRootKey, ...QueryKey] } & TReturnType

export type TKeyring<
    TKindIn extends TKind,
    TRootKey extends TKey,
    TDefsIn extends Record<string, (...args: any[]) => any>,
> = {
    all(): [TRootKey]
} & {
    [TDef in keyof TDefsIn]: TDefsIn[TDef] extends (...args: infer TParams) => infer TReturnType
        ? TDefs<TKindIn, TRootKey, TParams, TReturnType>
        : never
}

export function defineKeyring<
    TKindIn extends TKind,
    TRootKey extends TKey,
    TDefsIn extends Record<string, any>,
>(rootKey: TRootKey, defsIn: TDefsIn): TKeyring<TKindIn, TRootKey, TDefsIn> {
    return {
        all: () => [rootKey],
        ...defsIn,
    } as any
}

export const defineQueries = <TRootKey extends TKey, TDefsIn extends Record<string, any>>(
    rootKey: TRootKey,
    defsIn: TDefsIn,
) => defineKeyring<"query", TRootKey, TDefsIn>(rootKey, defsIn)

export const defineMutations = <TRootKey extends TKey, TDefsIn extends Record<string, any>>(
    rootKey: TRootKey,
    defsIn: TDefsIn,
) => defineKeyring<"mutation", TRootKey, TDefsIn>(rootKey, defsIn)

export function mutationOptions<
    TData = unknown,
    TError = DefaultError,
    TVariables = void,
    TContext = unknown,
>(options: UseMutationOptions<TData, TError, TVariables, TContext>) {
    return options
}

export { queryOptions } from "@tanstack/vue-query"
