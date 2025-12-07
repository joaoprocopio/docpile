import { constEnum, constEnumToValues } from "#shared/utils/const"

export const AuthRoutes = constEnum({
    SignIn: {
        value: "signin",
    },
    SignUp: {
        value: "signup",
    },
})
export const AuthRoutesArray = constEnumToValues(AuthRoutes)
export const AuthRoutesSet = new Set<string>(AuthRoutesArray)

export const OrgRoutes = constEnum({
    Create: {
        value: "org-create",
    },
    Home: {
        value: "org-home",
        params: {
            slug: "slug",
        },
    },
    Join: {
        value: "org-join",
        params: {
            slug: "slug",
            token: "token",
        },
    },
})

export const OrgRoutesArray = constEnumToValues(OrgRoutes)
export const OrgRoutesSet = new Set<string>(OrgRoutesArray)

export const OrgOnboardingRoutes = constEnum({
    Intro: {
        value: "org-onboarding-intro",
        params: {
            slug: "slug",
        },
    },
    Theme: {
        value: "org-onboarding-theme",
        params: {
            slug: "slug",
        },
    },
    Invite: {
        value: "org-onboarding-invite",
        params: {
            slug: "slug",
        },
    },
})

export const OrgOnboardingRoutesArray = constEnumToValues(OrgOnboardingRoutes)
export const OrgOnboardingRoutesSet = new Set<string>(OrgOnboardingRoutesArray)
