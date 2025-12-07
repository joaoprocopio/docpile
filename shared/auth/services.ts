import type { TUser, TUserInsert } from "#shared/auth/models"
import { users } from "#shared/auth/models"
import { db } from "#shared/db"
import { invariant } from "#shared/utils/invariant"
import { isNil } from "#shared/utils/is"
import { hashPassword, verifyPassword } from "#shared/utils/password"
import { eq } from "drizzle-orm"

export async function getUserById(userId: number): Promise<TUser | undefined> {
    const result = await db.select().from(users).where(eq(users.id, userId)).limit(1)

    return result.at(0)
}

export async function getUserByEmail(email: string): Promise<TUser | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1)

    return result.at(0)
}

export async function createUser(
    email: string,
    password: string,
    displayName: string,
): Promise<TUser> {
    const hashedPassword = await hashPassword(password)

    const newUser: TUserInsert = {
        email: email,
        password: hashedPassword,
        display_name: displayName,
    }

    const result = await db.insert(users).values(newUser).returning()
    const user = result.at(0)

    invariant(!isNil(user), "Failed to created user")

    return user
}

export async function authenticateUser(
    email: string,
    password: string,
): Promise<TUser | undefined> {
    const user = await getUserByEmail(email)

    if (isNil(user)) {
        return undefined
    }

    const isValid = await verifyPassword(password, user.password)

    if (isNil(isValid)) {
        return undefined
    }

    return user
}

export async function onboardUser(userId: number): Promise<TUser> {
    const result = await db
        .update(users)
        .set({ is_onboarded: true })
        .where(eq(users.id, userId))
        .returning()
    const user = result.at(0)

    invariant(!isNil(user), "Failed to onboard user")

    return user
}

export async function isEmailTaken(email: string): Promise<boolean> {
    const user = await getUserByEmail(email)

    return !isNil(user)
}
