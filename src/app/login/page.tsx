"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { ArrowRight, Eye, EyeOff, LockKeyhole, ShieldCheck, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DEMO_MODE_ENABLED, type DemoRole } from "@/lib/auth/demo-session";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<DemoRole>("squadron-leader");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!DEMO_MODE_ENABLED) {
      setError("Authentication is unavailable because no backend connection is configured. No sign-in was attempted.");
      return;
    }

    setBusy(true);
    try {
      const response = await fetch("/api/demo-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (!response.ok) {
        const result = (await response.json()) as { error?: string };
        throw new Error(result.error ?? "Could not start the demo preview.");
      }
      router.replace(role === "headquarters" ? "/headquarter" : "/squadron");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not start the demo preview.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-brand-background p-0 text-slate-950 lg:p-5">
      <div className="mx-auto flex min-h-screen max-w-[1500px] overflow-hidden bg-white shadow-sm lg:min-h-[calc(100vh-2.5rem)] lg:rounded-3xl lg:shadow-xl lg:shadow-slate-200/60">
        <section className="relative hidden w-[60%] overflow-hidden bg-brand-primary-dark lg:block" aria-label="Aeropulse overview">
          <Image src="/aeropulse-banner.svg" alt="Aircraft flying above a layered blue horizon" fill priority className="object-cover" sizes="60vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-primary-dark/95 via-brand-primary/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-12 text-white xl:p-16">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-white/12 ring-1 ring-white/25 backdrop-blur-sm"><ShieldCheck className="size-6 text-brand-secondary-light" /></div>
              <span className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-secondary-light">Aeropulse</span>
            </div>
            <h1 className="max-w-xl text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">Mission control, connected.</h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-slate-200/85">Secure access to the Aeropulse command network. Stay informed, coordinate with precision, and keep every mission moving forward.</p>
            <div className="mt-10 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.16em] text-brand-secondary-light/75"><span className="size-2 rounded-full bg-amber-400" />Backend connection not configured</div>
          </div>
        </section>

        <section className="flex w-full items-center justify-center px-6 py-12 sm:px-12 lg:w-[40%] lg:px-12 xl:px-20">
          <div className="w-full max-w-md">
            <div className="mb-10 lg:hidden"><div className="mb-5 flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-xl bg-brand-primary-dark text-brand-secondary-light"><ShieldCheck className="size-5" /></div><span className="text-sm font-bold uppercase tracking-[0.22em] text-brand-primary">Aeropulse</span></div></div>
            <div className="mb-8"><p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-secondary">{DEMO_MODE_ENABLED ? "Development preview" : "Welcome back"}</p><h2 className="text-3xl font-semibold tracking-tight text-slate-950">{DEMO_MODE_ENABLED ? "Explore the command interface" : "Sign in to your account"}</h2><p className="mt-3 text-sm leading-6 text-slate-500">{DEMO_MODE_ENABLED ? "Preview the role-specific interface with clearly labeled sample data. This does not authenticate with a backend." : "Enter your credentials to continue to the command network."}</p></div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {!DEMO_MODE_ENABLED && <>
                <div className="space-y-2"><Label htmlFor="user-id" className="text-slate-700">ID</Label><div className="relative"><UserRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><Input id="user-id" name="userId" placeholder="Enter your ID" autoComplete="username" required className="h-11 rounded-xl border-slate-200 pl-10 shadow-none" /></div></div>
                <div className="space-y-2"><div className="flex items-center justify-between"><Label htmlFor="password" className="text-slate-700">Password</Label><button type="button" onClick={() => setError("Password recovery is not available until the authentication backend is connected.")} className="text-xs font-semibold text-brand-secondary transition-colors hover:text-brand-secondary-hover">Forgot password?</button></div><div className="relative"><LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><Input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" autoComplete="current-password" required className="h-11 rounded-xl border-slate-200 pl-10 pr-11 shadow-none" /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((visible) => !visible)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:text-brand-primary focus-visible:outline-2 focus-visible:outline-brand-secondary">{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></div></div>
              </>}
              <div className="space-y-3"><Label className="text-slate-700">Role</Label><RadioGroup value={role} onValueChange={setRole} className="grid grid-cols-2 gap-3"><label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition-colors ${role === "squadron-leader" ? "border-brand-secondary bg-brand-secondary-light" : "border-slate-200 hover:bg-slate-50"}`}><RadioGroupItem value="squadron-leader" aria-label="Squadron leader" /><span className="text-sm font-medium leading-5 text-slate-700">Squadron leader</span></label><label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition-colors ${role === "headquarters" ? "border-brand-secondary bg-brand-secondary-light" : "border-slate-200 hover:bg-slate-50"}`}><RadioGroupItem value="headquarters" aria-label="Headquarters" /><span className="text-sm font-medium leading-5 text-slate-700">Headquarters</span></label></RadioGroup></div>
              <Button type="submit" disabled={busy} className="h-11 w-full rounded-xl !bg-brand-primary-dark text-sm font-semibold !text-white shadow-lg shadow-brand-primary-dark/15 transition-all hover:!bg-brand-primary-hover">{busy ? "Opening preview…" : DEMO_MODE_ENABLED ? "Enter demo preview" : "Sign in"}<ArrowRight className="ml-1 size-4" /></Button>
              {error && <p role="alert" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-5 text-amber-900">{error}</p>}
            </form>
            <p className="mt-10 text-center text-xs leading-5 text-slate-400">{DEMO_MODE_ENABLED ? "Demo preview only. No real authentication or operational connection." : "Authorized personnel only. Activity is monitored and secured."}</p>
          </div>
        </section>
      </div>
    </main>
  );
}
