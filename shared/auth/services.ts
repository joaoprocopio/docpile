import type { TUser, TUserInsert } from "#shared/auth/models"
import { users } from "#shared/auth/models"
import { db } from "#shared/db"
import { hashPassword, verifyPassword } from "#shared/utils/password"
import { eq } from "drizzle-orm"

export async function getUserById(userId: number): Promise<TUser | null> {
    const result = await db.query.users.findFirst({
        where: eq(users.id, userId),
    })

    return result ?? null
}

export async function getUserByEmail(email: string): Promise<TUser | null> {
    const result = await db.query.users.findFirst({
        where: eq(users.email, email),
    })

    return result ?? null
}

export async function createUser(
    email: string,
    password: string,
    displayName: string,
): Promise<TUser> {
    const hashedPassword = await hashPassword(password)

    const newUser: TUserInsert = {
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

export async function isEmailTaken(email: string): Promise<boolean> {
    const user = await getUserByEmail(email)
    return user !== null
}
