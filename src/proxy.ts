import { NextResponse, type NextRequest } from "next/server"

const ROLE_COOKIE = "aeropulse-demo-role"
// This standalone copy runs with its local preview session unless explicitly disabled.
const DEMO_MODE_ENABLED = process.env.NEXT_PUBLIC_AEROPULSE_DEMO_MODE !== "false"

export function proxy(request: NextRequest) {
  const requestedRole = request.nextUrl.pathname.startsWith("/headquarter")
    ? "headquarters"
    : "squadron-leader"
  const role = request.cookies.get(ROLE_COOKIE)?.value
  const loginUrl = new URL("/login", request.url)

  if (!DEMO_MODE_ENABLED || (role !== "headquarters" && role !== "squadron-leader")) {
    loginUrl.searchParams.set("next", request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (role !== requestedRole) {
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/headquarter/:path*", "/squadron/:path*"],
}
