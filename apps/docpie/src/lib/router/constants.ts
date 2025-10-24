export const AuthRoutes = {
    SignIn: "signin",
    SignUp: "signup",
}

export const AuthRoutesSet = new Set(Object.values(AuthRoutes))

export const OnboardingRoutes = {
    Intro: "onboarding-intro",
    Theme: "onboarding-theme",
    Org: "onboarding-org",
    Team: "onboarding-team",
}

export const OnboardingRoutesSet = new Set(Object.values(OnboardingRoutes))

export const HomeRoute = "home"
