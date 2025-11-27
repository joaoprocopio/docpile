import { constEnum, constEnumToValues } from "~/lib/const"

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
    OnboardingIntro: {
        value: "org-onboarding-intro",
        params: {
            slug: "slug",
        },
    },
    OnboardingTheme: {
        value: "org-onboarding-theme",
        params: {
            slug: "slug",
        },
    },
    OnboardingInvite: {
        value: "org-onboarding-invite",
        params: {
            slug: "slug",
        },
    },
})

export const OrgRoutesArray = constEnumToValues(OrgRoutes)
export const OrgRoutesSet = new Set<string>(OrgRoutesArray)

export const OnboardingRoutesArray = Object.values(OrgRoutes.Onboarding)
export const OnboardingRoutesSet = new Set<string>(OnboardingRoutesArray)
