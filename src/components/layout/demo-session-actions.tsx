"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"

export function DemoSessionActions({ role, appearance = "default" }: { role: string; appearance?: "default" | "squadron" }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

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

  return (
    <div className={appearance === "squadron" ? "squadron-session-actions flex w-full items-center justify-between gap-3" : "flex items-center gap-3"}>
      <span className={appearance === "squadron" ? "text-sm font-bold text-white" : "hidden text-xs font-semibold text-amber-800 sm:inline"}>
        {role}
      </span>
      <Button type="button" variant="outline" size={appearance === "squadron" ? "default" : "sm"} disabled={busy} onClick={signOut} aria-label="End preview" className={appearance === "squadron" ? "squadron-exit-preview h-10 rounded-xl px-4 font-semibold" : undefined}>
        <LogOut className="size-4" />
        {busy ? "Ending…" : "Exit preview"}
      </Button>
      {error && <span role="alert" className="sr-only">{error}</span>}
    </div>
  )
}
