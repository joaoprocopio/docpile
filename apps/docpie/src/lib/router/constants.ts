export const AuthRoutes = {
    SignIn: "signin",
    SignUp: "signup",
}

export const UnauthorizedRoutes = new Set(Object.values(AuthRoutes))

export const OnboardingIntroRouteName = "onboarding-intro"
export const OnboardingThemeRouteName = "onboarding-theme"
export const OnboardingOrgRouteName = "onboarding-org"
export const OnboardingTeamRouteName = "onboarding-team"

export const OnboardingRoutes = new Set([
    OnboardingIntroRouteName,
    OnboardingThemeRouteName,
    OnboardingOrgRouteName,
    OnboardingTeamRouteName,
])

export const HomeRouteName = "home"
