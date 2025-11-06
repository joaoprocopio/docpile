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
}

export const OrgRoutesArray = Object.values(OrgRoutes)
export const OrgRoutesSet = new Set(Object.values(OrgRoutes))

export const AppRoutes = {
    Home: "home",
}
