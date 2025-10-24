export const AuthRoutes = {
    SignIn: "signin",
    SignUp: "signup",
}

export const AuthRoutesArray = Object.values(AuthRoutes)
export const AuthRoutesSet = new Set(AuthRoutesArray)

export const OnboardingRoutes = {
    Intro: "onboarding-intro",
    Org: "onboarding-org",
    Team: "onboarding-team",
    Theme: "onboarding-theme",
}

export const OnboardingRoutesArray = Object.values(OnboardingRoutes)
export const OnboardingRoutesSet = new Set(Object.values(OnboardingRoutes))

export const AppRoutes = {
    Home: "home",
}
