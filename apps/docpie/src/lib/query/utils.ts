/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DefaultError, UseMutationOptions } from "@tanstack/vue-query"

export type TKey = string
export type TAnyDef = (...args: any[]) => any
export type TAnyDefs = Record<TKey, TAnyDef>
export type TActionKind = "query" | "mutation"

export type TKeyring<TKind extends TActionKind, TRootKey extends TKey, TDefs extends TAnyDefs> = {
    all(): [TRootKey] | TRootKey[]
} & {
    [TDef in keyof TDefs]: TDefs[TDef] extends (...args: infer TArgs) => infer TReturnType
        ? (
              ...args: TArgs
          ) => TKind extends "query"
              ? { queryKey: [TRootKey, TDef, ...unknown[]] } & TReturnType
              : TKind extends "mutation"
                ? { mutationKey: [TRootKey, TDef, ...unknown[]] } & TReturnType
                : never
        : never
}

export function defineQueries<TRootKey extends TKey, TDefs extends TAnyDefs>(
    defs: TKeyring<"query", TRootKey, TDefs>,
): TKeyring<"query", TRootKey, TDefs> {
    return defs
}

export function defineMutations<TRootKey extends TKey, TDefs extends TAnyDefs>(
    defs: TKeyring<"mutation", TRootKey, TDefs>,
): TKeyring<"mutation", TRootKey, TDefs> {
    return defs
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
