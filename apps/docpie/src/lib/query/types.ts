import type {
    DefaultError,
    QueryKey,
    UseMutationOptions,
    UseQueryOptions,
} from "@tanstack/vue-query"

// ============================================================================
// Core Types
// ============================================================================

export type TKey = string

export const BaseKeySymbol = Symbol("baseKey")

export type TBaseKeySymbol = typeof BaseKeySymbol

// ============================================================================
// Query Types
// ============================================================================

/**
 * A function that returns query options when called with arguments
 */
export type QueryFunction<TArgs extends unknown[], TData, TError = DefaultError> = (
    ...args: TArgs
) => UseQueryOptions<TData, TError>

/**
 * Pre-keyring for queries - maps query names to their functions
 */
export type TPreQueryKeyring = Record<string, QueryFunction<unknown[], unknown, unknown>>

/**
 * The final query keyring with base key access and all() method
 */
export type TQueryKeyring<TBaseKey extends TKey, TPreKeyring extends TPreQueryKeyring> = {
    [BaseKeySymbol]: TBaseKey
    all(): QueryKey
} & {
    [K in keyof TPreKeyring]: TPreKeyring[K]
}

// ============================================================================
// Mutation Types
// ============================================================================

/**
 * A function that returns mutation options when called with arguments
 */
export type MutationFunction<
    TArgs extends unknown[],
    TData,
    TVariables,
    TError = DefaultError,
    TContext = unknown,
> = (...args: TArgs) => UseMutationOptions<TData, TError, TVariables, TContext>

/**
 * Pre-keyring for mutations - maps mutation names to their functions
 */
export type TPreMutationKeyring = Record<
    string,
    MutationFunction<unknown[], unknown, unknown, unknown, unknown>
>

/**
 * The final mutation keyring with base key access and all() method
 */
export type TMutationKeyring<TBaseKey extends TKey, TPreKeyring extends TPreMutationKeyring> = {
    [BaseKeySymbol]: TBaseKey
    all(): QueryKey
} & {
    [K in keyof TPreKeyring]: TPreKeyring[K]
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Helper to create query options with proper typing
 */
export function queryOptions<TData, TError = DefaultError>(
    options: UseQueryOptions<TData, TError>,
): UseQueryOptions<TData, TError> {
    return options
}

/**
 * Helper to create mutation options with proper typing
 */
export function mutationOptions<
    TData,
    TError = DefaultError,
    TVariables = void,
    TContext = unknown,
>(
    options: UseMutationOptions<TData, TError, TVariables, TContext>,
): UseMutationOptions<TData, TError, TVariables, TContext> {
    return options
}

// ============================================================================
// Main API
// ============================================================================

/**
 * Define a collection of queries with a shared base key
 *
 * @example
 * ```ts
 * const userQueries = defineQueries("users", {
 *   byId: (id: string) =>
 *     queryOptions({
 *       queryKey: ["users", "byId", id],
 *       queryFn: () => fetchUser(id),
 *     }),
 *   list: (filters?: UserFilters) =>
 *     queryOptions({
 *       queryKey: ["users", "list", filters],
 *       queryFn: () => fetchUsers(filters),
 *     }),
 * })
 *
 * // Usage
 * const user = useQuery(userQueries.byId("123"))
 * queryClient.invalidateQueries({ queryKey: userQueries.all() })
 * ```
 */
export function defineQueries<TBaseKey extends TKey, TPreKeyring extends TPreQueryKeyring>(
    baseKey: TBaseKey,
    preKeyring: TPreKeyring,
): TQueryKeyring<TBaseKey, TPreKeyring> {
    return {
        [BaseKeySymbol]: baseKey,
        all() {
            return [baseKey]
        },
        ...preKeyring,
    } as TQueryKeyring<TBaseKey, TPreKeyring>
}

/**
 * Define a collection of mutations with a shared base key
 *
 * @example
 * ```ts
 * const userMutations = defineMutations("users", {
 *   create: () =>
 *     mutationOptions({
 *       mutationKey: ["users", "create"],
 *       mutationFn: (data: CreateUserData) => createUser(data),
 *     }),
 *   update: (id: string) =>
 *     mutationOptions({
 *       mutationKey: ["users", "update", id],
 *       mutationFn: (data: UpdateUserData) => updateUser(id, data),
 *     }),
 * })
 *
 * // Usage
 * const createMutation = useMutation(userMutations.create())
 * const updateMutation = useMutation(userMutations.update("123"))
 * ```
 */
export function defineMutations<TBaseKey extends TKey, TPreKeyring extends TPreMutationKeyring>(
    baseKey: TBaseKey,
    preKeyring: TPreKeyring,
): TMutationKeyring<TBaseKey, TPreKeyring> {
    return {
        [BaseKeySymbol]: baseKey,
        all() {
            return [baseKey]
        },
        ...preKeyring,
    } as TMutationKeyring<TBaseKey, TPreKeyring>
}

// ============================================================================
// Usage Examples
// ============================================================================

/**
 * Example: User queries
 */
export const exampleUserQueries = defineQueries("users", {
    // Simple query with no args
    all: () =>
        queryOptions({
            queryKey: ["users", "all"],
            queryFn: async () => {
                // Fetch logic
                return [] as User[]
            },
        }),

    // Query with single arg
    byId: (id: string) =>
        queryOptions({
            queryKey: ["users", "byId", id],
            queryFn: async () => {
                // Fetch logic
                return {} as User
            },
        }),

    // Query with multiple args
    search: (query: string, limit: number) =>
        queryOptions({
            queryKey: ["users", "search", query, limit],
            queryFn: async () => {
                // Fetch logic
                return [] as User[]
            },
            staleTime: 5000,
        }),

    // Query with object arg
    filter: (filters: UserFilters) =>
        queryOptions({
            queryKey: ["users", "filter", filters],
            queryFn: async () => {
                // Fetch logic
                return [] as User[]
            },
        }),
})

/**
 * Example: User mutations
 */
export const exampleUserMutations = defineMutations("users", {
    // Mutation with no setup args
    create: () =>
        mutationOptions({
            mutationKey: ["users", "create"],
            mutationFn: async (_data: CreateUserData) => {
                // Create logic
                return {} as User
            },
        }),

    // Mutation with setup arg
    update: (id: string) =>
        mutationOptions({
            mutationKey: ["users", "update", id],
            mutationFn: async (_data: UpdateUserData) => {
                // Update logic
                return {} as User
            },
        }),

    // Mutation with multiple setup args
    assign: (userId: string, roleId: string) =>
        mutationOptions({
            mutationKey: ["users", "assign", userId, roleId],
            mutationFn: async () => {
                // Assignment logic
                return true
            },
        }),
})

// ============================================================================
// Type Definitions for Examples
// ============================================================================

interface User {
    id: string
    name: string
    email: string
}

interface UserFilters {
    role?: string
    status?: string
}

interface CreateUserData {
    name: string
    email: string
}

interface UpdateUserData {
    name?: string
    email?: string
}
