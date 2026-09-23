export type Audience = "home" | "agency" | "caregiver" | "shared";

export function audienceForPath(pathname: string): Audience {
  if (pathname === "/") return "home";
  if (
    pathname === "/for-caregivers" ||
    pathname.startsWith("/signup/caregiver") ||
    pathname === "/c" ||
    pathname.startsWith("/c/")
  ) {
    return "caregiver";
  }
  if (
    pathname === "/for-agencies" ||
    pathname === "/pricing" ||
    pathname.startsWith("/signup/agency") ||
    pathname === "/search" ||
    pathname.startsWith("/search/")
  ) {
    return "agency";
  }
  return "shared";
}
