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
export const AllKeySymbol = Symbol("allKey")

export type TBaseKeySymbol = typeof BaseKeySymbol
export type TAllKeySymbol = typeof AllKeySymbol

// ============================================================================
// Query Builder Types
// ============================================================================

/**
 * A function that takes a base key and returns a query options builder
 */
export type QueryBuilder<TArgs extends unknown[], TData, TError = DefaultError> = (
    baseKey: TKey,
) => (...args: TArgs) => UseQueryOptions<TData, TError>

/**
 * A function that can be called with args to get query options
 */
export type QueryRunner<TArgs extends unknown[], TData, TError = DefaultError> = (
    ...args: TArgs
) => UseQueryOptions<TData, TError>

/**
 * Pre-keyring for queries - maps query names to their builders
 */
export type TPreQueryKeyring<TKeys extends TKey> = {
    [K in TKeys]: QueryBuilder<any[], any, any>
}

/**
 * The final query keyring with base key access and all() method
 */
export type TQueryKeyring<TBaseKey extends TKey, TPreKeyring extends TPreQueryKeyring<any>> = {
    [BaseKeySymbol]: TBaseKey
    all(): QueryKey
} & {
    [K in keyof TPreKeyring]: TPreKeyring[K] extends QueryBuilder<
        infer TArgs,
        infer TData,
        infer TError
    >
        ? QueryRunner<TArgs, TData, TError>
        : never
}

// ============================================================================
// Mutation Builder Types
// ============================================================================

/**
 * A function that takes a base key and returns a mutation options builder
 */
export type MutationBuilder<
    TArgs extends unknown[],
    TData,
    TVariables,
    TError = DefaultError,
    TContext = unknown,
> = (baseKey: TKey) => (...args: TArgs) => UseMutationOptions<TData, TError, TVariables, TContext>

/**
 * A function that can be called with args to get mutation options
 */
export type MutationRunner<
    TArgs extends unknown[],
    TData,
    TVariables,
    TError = DefaultError,
    TContext = unknown,
> = (...args: TArgs) => UseMutationOptions<TData, TError, TVariables, TContext>

/**
 * Pre-keyring for mutations - maps mutation names to their builders
 */
export type TPreMutationKeyring<TKeys extends TKey> = {
    [K in TKeys]: MutationBuilder<any[], any, any, any, any>
}

/**
 * The final mutation keyring with base key access and all() method
 */
export type TMutationKeyring<
    TBaseKey extends TKey,
    TPreKeyring extends TPreMutationKeyring<any>,
> = {
    [BaseKeySymbol]: TBaseKey
    all(): QueryKey
} & {
    [K in keyof TPreKeyring]: TPreKeyring[K] extends MutationBuilder<
        infer TArgs,
        infer TData,
        infer TVariables,
        infer TError,
        infer TContext
    >
        ? MutationRunner<TArgs, TData, TVariables, TError, TContext>
        : never
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
 *   byId: (baseKey) => (id: string) =>
 *     queryOptions({
 *       queryKey: [baseKey, "byId", id],
 *       queryFn: () => fetchUser(id),
 *     }),
 *   list: (baseKey) => (filters?: UserFilters) =>
 *     queryOptions({
 *       queryKey: [baseKey, "list", filters],
 *       queryFn: () => fetchUsers(filters),
 *     }),
 * })
 *
 * // Usage
 * const user = useQuery(userQueries.byId("123"))
 * queryClient.invalidateQueries({ queryKey: userQueries.all() })
 * ```
 */
export function defineQueries<
    TBaseKey extends TKey,
    TPreKeyring extends TPreQueryKeyring<keyof TPreKeyring & string>,
>(baseKey: TBaseKey, preKeyring: TPreKeyring): TQueryKeyring<TBaseKey, TPreKeyring> {
    const keyring: any = {
        [BaseKeySymbol]: baseKey,
        all() {
            return [baseKey]
        },
    }

    // Transform each builder into a runner
    for (const key in preKeyring) {
        const builder = preKeyring[key]
        keyring[key] = builder(baseKey)
    }

    return keyring
}

/**
 * Define a collection of mutations with a shared base key
 *
 * @example
 * ```ts
 * const userMutations = defineMutations("users", {
 *   create: (baseKey) => () =>
 *     mutationOptions({
 *       mutationKey: [baseKey, "create"],
 *       mutationFn: (data: CreateUserData) => createUser(data),
 *     }),
 *   update: (baseKey) => (id: string) =>
 *     mutationOptions({
 *       mutationKey: [baseKey, "update", id],
 *       mutationFn: (data: UpdateUserData) => updateUser(id, data),
 *     }),
 * })
 *
 * // Usage
 * const createMutation = useMutation(userMutations.create())
 * const updateMutation = useMutation(userMutations.update("123"))
 * ```
 */
export function defineMutations<
    TBaseKey extends TKey,
    TPreKeyring extends TPreMutationKeyring<keyof TPreKeyring & string>,
>(baseKey: TBaseKey, preKeyring: TPreKeyring): TMutationKeyring<TBaseKey, TPreKeyring> {
    const keyring: any = {
        [BaseKeySymbol]: baseKey,
        all() {
            return [baseKey]
        },
    }

    // Transform each builder into a runner
    for (const key in preKeyring) {
        const builder = preKeyring[key]
        keyring[key] = builder(baseKey)
    }

    return keyring
}

// ============================================================================
// Usage Examples
// ============================================================================

/**
 * Example: User queries
 */
export const exampleUserQueries = defineQueries("users", {
    // Simple query with no args
    all: (baseKey) => () =>
        queryOptions({
            queryKey: [baseKey, "all"],
            queryFn: async () => {
                // Fetch logic
                return [] as User[]
            },
        }),

    // Query with single arg
    byId: (baseKey) => (id: string) =>
        queryOptions({
            queryKey: [baseKey, "byId", id],
            queryFn: async () => {
                // Fetch logic
                return {} as User
            },
        }),

    // Query with multiple args
    search: (baseKey) => (query: string, limit: number) =>
        queryOptions({
            queryKey: [baseKey, "search", query, limit],
            queryFn: async () => {
                // Fetch logic
                return [] as User[]
            },
            staleTime: 5000,
        }),

    // Query with object arg
    filter: (baseKey) => (filters: UserFilters) =>
        queryOptions({
            queryKey: [baseKey, "filter", filters],
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
    create: (baseKey) => () =>
        mutationOptions({
            mutationKey: [baseKey, "create"],
            mutationFn: async (data: CreateUserData) => {
                // Create logic
                return {} as User
            },
        }),

    // Mutation with setup arg
    update: (baseKey) => (id: string) =>
        mutationOptions({
            mutationKey: [baseKey, "update", id],
            mutationFn: async (data: UpdateUserData) => {
                // Update logic
                return {} as User
            },
        }),

    // Mutation with multiple setup args
    assign: (baseKey) => (userId: string, roleId: string) =>
        mutationOptions({
            mutationKey: [baseKey, "assign", userId, roleId],
            mutationFn: async () => {
                // Assignment logic
                return true
            },
        }),
})

exampleUserMutations.all()

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
