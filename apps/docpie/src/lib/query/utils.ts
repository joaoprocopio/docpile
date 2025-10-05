/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DefaultError, MutationKey, QueryKey, UseMutationOptions } from "@tanstack/vue-query"

export type QueryKeyFactory<T extends string = string> = {
    all: () => [T]
    [key: string]: (...args: any[]) => QueryKey
}

export type MutationKeyFactory<T extends string = string> = {
    all: () => [T]
    [key: string]: (...args: any[]) => MutationKey
}

export type QueryFactory<T extends string = string> = QueryKeyFactory<T> & {
    [K in keyof QueryKeyFactory<T>]: K extends "all"
        ? QueryKeyFactory<T>[K]
        : ((...args: any[]) => any) | QueryKeyFactory<T>[K]
}

export type MutationFactory<T extends string = string> = MutationKeyFactory<T> & {
    [K in keyof MutationKeyFactory<T>]: K extends "all"
        ? MutationKeyFactory<T>[K]
        : ((...args: any[]) => any) | MutationKeyFactory<T>[K]
}

export type ExtractBaseKey<T> = T extends QueryKeyFactory<infer U> ? U : never

export function defineQueries<T extends string>(factory: {
    all: () => [T]
    [K: string]: any
}): QueryFactory<T> {
    return factory as QueryFactory<T>
}

export function defineMutations<T extends string>(factory: {
    all: () => [T]
    [K: string]: any
}): MutationFactory<T> {
    return factory as MutationFactory<T>
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
