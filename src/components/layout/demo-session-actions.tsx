"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut, RadioTower, ShieldCheck } from "lucide-react"
import type { DemoRole } from "@/lib/auth/demo-session"

export function DemoSessionActions({ role }: { role: DemoRole }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [previewActive, setPreviewActive] = useState(false)

  useEffect(() => {
    let active = true
    void fetch("/api/demo-session", { method: "GET", cache: "no-store", credentials: "same-origin" })
      .then(async (response) => {
        if (!response.ok) return null
        return response.json() as Promise<{ enabled?: boolean; role?: DemoRole | null }>
      })
      .then((session) => {
        if (active) setPreviewActive(session?.enabled === true && session.role === role)
      })
      .catch(() => {
        if (active) setPreviewActive(false)
      })
    return () => { active = false }
  }, [role])

  async function signOut() {
    setBusy(true)
    setError("")
    try {
      const response = await fetch("/api/demo-session", { method: "DELETE" })
      if (!response.ok) throw new Error("Session endpoint returned an error")
      router.replace("/login")
      router.refresh()
    } catch {
      setError("Could not end the preview. Check the local app connection and try again.")
    } finally {
      setBusy(false)
    }
  }

  if (!previewActive) return null

  const RoleIcon = role === "squadron-leader" ? RadioTower : ShieldCheck
  const roleLabel = role === "squadron-leader" ? "Squadron Leader" : "Headquarters"

  return (
    <div className="preview-menu-session">
      <div className="preview-menu-role">
        <span className="preview-menu-role-icon"><RoleIcon className="size-4" aria-hidden="true" /></span>
        <span className="preview-menu-role-label">{roleLabel}</span>
      </div>
      <button type="button" disabled={busy} onClick={signOut} aria-label="Exit preview" aria-busy={busy} className="preview-exit-menu-button">
        <LogOut className="size-4" aria-hidden="true" />
        {busy ? "Ending…" : "Exit preview"}
      </button>
      {error && <span role="alert" className="preview-session-error">{error}</span>}
    </div>
  )
}
