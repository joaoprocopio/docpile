import { flattenObject } from "~/utils/flattener"

export const AuthRoutes = {
    SignIn: "signin",
    SignUp: "signup",
}

export const AuthRoutesArray = Object.values(AuthRoutes)
export const AuthRoutesSet = new Set(AuthRoutesArray)

export const OrgRoutes = {
    Create: "org-create",
    Onboarding: {
        Intro: "org-onboarding-intro",
        Team: "org-onboarding-team",
        Theme: "org-onboarding-theme",
    },
    Home: "home",
}

export const OrgRoutesArray = Object.values(flattenObject(OrgRoutes))
export const OrgRoutesSet = new Set(OrgRoutesArray)

export const OrgOnboardingRoutesArray = Object.values(flattenObject(OrgRoutes.Onboarding))
export const OrgOnboardingRoutesSet = new Set(OrgRoutesArray)
