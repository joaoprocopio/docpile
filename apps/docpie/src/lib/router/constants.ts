import { flattenObject } from "~/utils/flattener"

export const AuthRoutes = {
    SignIn: "signin",
    SignUp: "signup",
}
export const AuthRoutesSet = new Set<string>(Object.values(AuthRoutes))

export const OrgRoutes = {
    Home: "org-home",
    Create: "org-create",
    Onboarding: {
        Intro: "org-onboarding-intro",
        Team: "org-onboarding-team",
        Theme: "org-onboarding-theme",
    },
}

export const OrgRoutesSet = new Set<string>(Object.values(flattenObject(OrgRoutes)))
export const OrgOnboardingRoutesSet = new Set<string>(
    Object.values(flattenObject(OrgRoutes.Onboarding)),
)

export const OrgSlugParam = "slug"
