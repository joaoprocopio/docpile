import { db } from "#shared/db/client"
import { users, type TUser, type TNewUser } from "#shared/db/schema"
import { hashPassword, verifyPassword } from "#shared/utils/password"
import { eq } from "drizzle-orm"

/**
 * Gets a user by their ID.
 */
export async function getUserById(userId: number): Promise<TUser | null> {
    const result = await db.query.users.findFirst({
        where: eq(users.id, userId),
    })
    return result ?? null
}

/**
 * Gets a user by their email.
 */
export async function getUserByEmail(email: string): Promise<TUser | null> {
    const result = await db.query.users.findFirst({
        where: eq(users.email, email),
    })
    return result ?? null
}

/**
 * Creates a new user with hashed password.
 */
export async function createUser(
    email: string,
    password: string,
    displayName: string,
): Promise<TUser> {
    const hashedPassword = await hashPassword(password)

    const newUser: TNewUser = {
        email,
        password: hashedPassword,
        display_name: displayName,
        is_onboarded: false,
    }

    const result = await db.insert(users).values(newUser).returning()
    const user = result[0]

    if (!user) {
        throw new Error("Failed to create user")
    }

    return user
}

/**
 * Authenticates a user with email and password.
 * Returns the user if credentials are valid, null otherwise.
 */
export async function authenticateUser(email: string, password: string): Promise<TUser | null> {
    const user = await getUserByEmail(email)
    if (!user) {
        return null
    }

    const isValid = await verifyPassword(password, user.password)
    if (!isValid) {
        return null
    }

    return user
}

/**
 * Marks a user as onboarded.
 */
export async function onboardUser(userId: number): Promise<TUser> {
    const result = await db
        .update(users)
        .set({ is_onboarded: true })
        .where(eq(users.id, userId))
        .returning()

    const user = result[0]

    if (!user) {
        throw new Error("Failed to onboard user")
    }

    return user
}

/**
 * Checks if an email is already registered.
 */
export async function isEmailTaken(email: string): Promise<boolean> {
    const user = await getUserByEmail(email)
    return user !== null
}
