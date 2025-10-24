export const SignInRoute = "signin"
export const SignUpRoute = "signup"

export const UnauthorizedRoutes = new Set([SignInRoute, SignUpRoute])

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
