export const AuthRoutes = {
    SignIn: "signin",
    SignUp: "signup",
}

export const AuthRoutesArray = Object.values(AuthRoutes)
export const AuthRoutesSet = new Set(AuthRoutesArray)

export const OnboardingRoutes = {
    Intro: "onboarding-intro",
    Theme: "onboarding-theme",
    Org: "onboarding-org",
    Team: "onboarding-team",
}

export const OnboardingRoutesArray = Object.values(OnboardingRoutes)
export const OnboardingRoutesSet = new Set(Object.values(OnboardingRoutes))

export const AppRoutes = {
    Home: "home",
}
