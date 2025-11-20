import { asConst } from "~/lib/const"
import { flattenObject } from "~/utils/obj"

export const AuthRoutes = asConst({
    SignIn: "signin",
    SignUp: "signup",
})
export const AuthRoutesArray = Object.values(AuthRoutes)
export const AuthRoutesSet = new Set<string>(AuthRoutesArray)

export const OrgRoutes = asConst({
    Home: "org-home",
    Create: "org-create",
    Onboarding: {
        Intro: "org-onboarding-intro",
        Team: "org-onboarding-team",
        Theme: "org-onboarding-theme",
    },
})

export const OrgRoutesArray = Object.values<string>(flattenObject(OrgRoutes))
export const OrgRoutesSet = new Set<string>(OrgRoutesArray)

export const OnboardingRoutesArray = Object.values<string>(OrgRoutes.Onboarding)
export const OnboardingRoutesSet = new Set<string>(OnboardingRoutesArray)
