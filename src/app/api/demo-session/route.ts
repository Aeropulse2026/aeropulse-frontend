import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import {
  DEMO_MODE_ENABLED,
  DEMO_SESSION_COOKIE,
  isDemoRole,
} from "@/lib/auth/demo-session"

export async function GET() {
  if (!DEMO_MODE_ENABLED) {
    return NextResponse.json({ enabled: false, role: null })
  }

  const store = await cookies()
  const role = store.get(DEMO_SESSION_COOKIE)?.value
  return NextResponse.json({ enabled: true, role: isDemoRole(role) ? role : null })
}

export async function POST(request: Request) {
  if (!DEMO_MODE_ENABLED) {
    return NextResponse.json({ error: "preview is disabled." }, { status: 404 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 })
  }

  const role = (body as { role?: unknown } | null)?.role
  if (!isDemoRole(role)) {
    return NextResponse.json({ error: "Choose a valid preview role." }, { status: 400 })
  }

  const store = await cookies()
  store.set(DEMO_SESSION_COOKIE, role, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  })

  return NextResponse.json({ role, demo: true })
}

export async function DELETE() {
  const store = await cookies()
  store.delete(DEMO_SESSION_COOKIE)
  return NextResponse.json({ ok: true })
}
