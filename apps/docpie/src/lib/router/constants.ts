import { flattenObject } from "~/utils/flattener"

export const AuthRoutes = {
    SignIn: "signin",
    SignUp: "signup",
}
export const AuthRoutesArray = Object.values(AuthRoutes)
export const AuthRoutesSet = new Set<string>(AuthRoutesArray)

export const OrgRoutes = {
    Home: "org-home",
    Create: "org-create",
    Onboarding: {
        Intro: "org-onboarding-intro",
        Team: "org-onboarding-team",
        Theme: "org-onboarding-theme",
    },
}

export const OrgRoutesArray = Object.values<string>(flattenObject(OrgRoutes))
export const OrgRoutesSet = new Set<string>(OrgRoutesArray)

export const OnboardingRoutesArray = Object.values<string>(OrgRoutes.Onboarding)
export const OnboardingRoutesSet = new Set<string>(OnboardingRoutesArray)

export const SlugParam = "slug"
