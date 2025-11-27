import { asConst, constEnum, constEnumToValues } from "~/lib/const"
import { flattenObject } from "~/utils/obj"

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

export const OrgRoutes = asConst({
    Home: "org-home",
    Create: "org-create",
    Join: "org-join",
    Onboarding: {
        Intro: "org-onboarding-intro",
        Theme: "org-onboarding-theme",
        Invite: "org-onboarding-invite",
    },
})

export const OrgRoutesArray = Object.values(flattenObject(OrgRoutes))
export const OrgRoutesSet = new Set<string>(OrgRoutesArray)

export const OnboardingRoutesArray = Object.values(OrgRoutes.Onboarding)
export const OnboardingRoutesSet = new Set<string>(OnboardingRoutesArray)
