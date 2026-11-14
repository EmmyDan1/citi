"use client";
import { CitibankLogo } from "../../components/brand/citibank-logo";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    const normalizedEmail = email.trim().toLowerCase();

    const { error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    window.location.assign("/");
  }

  return (
    <main className="min-h-screen bg-[#f4f7fb] text-slate-950">
      <div className="min-h-screen lg:flex">
        {/* Blue header / brand area */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#032b55] via-[#075da8] to-[#0879cc] px-5 pb-20 pt-7 text-white sm:px-8 lg:flex lg:min-h-screen lg:w-[46%] lg:flex-col lg:justify-between lg:px-12 lg:pb-12 lg:pt-10 xl:px-16">
          {/* Decorative glow */}
          <div className="absolute -right-24 -top-28 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-28 h-80 w-80 rounded-full bg-cyan-300/10 blur-3xl" />

          {/* Brand */}
          <div className="relative z-10 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center"
              aria-label="Citibank home"
            >
              <CitibankLogo
                width={140}
                height={46}
                className="h-10 w-auto rounded-md"
              />
            </Link>

            <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-medium text-blue-50 backdrop-blur">
              <ShieldCheck className="h-3.5 w-3.5" />
              Secure
            </div>
          </div>

          {/* Desktop message */}
          <div className="relative z-10 mt-16 hidden max-w-md lg:block">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
              <Sparkles className="h-5 w-5 text-blue-100" />
            </div>

            <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-100">
              Welcome back
            </p>

            <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
              Your finances,
              <br />
              all in one place.
            </h1>

            <p className="mt-6 max-w-sm text-base leading-7 text-blue-100">
              Sign in to manage your accounts, review transactions, and stay
              connected to your financial activity.
            </p>
          </div>

          <div className="relative z-10 mt-10 hidden text-xs text-blue-100/70 lg:block">
            Secure account access
          </div>

          {/* Mobile heading */}
          <div className="relative z-10 mt-10 max-w-sm lg:hidden">
            <p className="text-sm font-medium text-blue-100">Welcome back</p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Sign in to your account
            </h1>

            <p className="mt-3 max-w-xs text-sm leading-6 text-blue-100">
              Access your accounts and manage your financial activity.
            </p>
          </div>
        </section>

        {/* Form */}
        <section className="-mt-10 relative z-20 px-4 pb-8 sm:px-6 lg:mt-0 lg:flex lg:flex-1 lg:items-center lg:justify-center lg:px-10 lg:pb-0">
          <div className="mx-auto w-full max-w-md">
            <div className="rounded-[26px] border border-slate-200/80 bg-white p-5 shadow-[0_24px_70px_-30px_rgba(6,26,50,0.35)] sm:p-7 lg:rounded-3xl lg:p-8">
              {/* Form header */}
              <div className="mb-7">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf4ff] text-[#075da8]">
                  <LockKeyhole className="h-5 w-5" />
                </div>

                <h2 className="mt-5 text-2xl font-semibold tracking-tight text-[#061a32]">
                  Sign in
                </h2>

                <p className="mt-1.5 text-sm leading-6 text-slate-500">
                  Enter your details to continue.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-slate-700"
                  >
                    Email address
                  </Label>

                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    inputMode="email"
                    placeholder="you@example.com"
                    required
                    className="mt-2 h-13 rounded-xl border-slate-200 bg-slate-50/70 px-4 text-[16px] shadow-none transition placeholder:text-slate-400 focus-visible:border-[#0876c9] focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-[#0876c9]/10"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-slate-700"
                    >
                      Password
                    </Label>
                  </div>

                  <div className="relative mt-2">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      autoComplete="current-password"
                      required
                      className="h-13 rounded-xl border-slate-200 bg-slate-50/70 px-4 pr-12 text-[16px] shadow-none transition placeholder:text-slate-400 focus-visible:border-[#0876c9] focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-[#0876c9]/10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {message && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3"
                  >
                    <p className="text-sm leading-5 text-red-700">{message}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="h-13 w-full rounded-xl bg-[#075da8] text-[15px] font-semibold text-white shadow-[0_8px_20px_-8px_rgba(7,93,168,0.8)] transition hover:bg-[#064f91] active:scale-[0.99] disabled:opacity-70"
                >
                  {loading ? (
                    "Signing in..."
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              {/* Register */}
              <div className="mt-7 border-t border-slate-100 pt-6">
                <p className="text-center text-sm text-slate-500">
                  Don't have an account?{" "}
                  <Link
                    href="/register"
                    className="font-semibold text-[#075da8] hover:underline hover:underline-offset-4"
                  >
                    Create one
                  </Link>
                </p>
              </div>
            </div>

            {/* Security footer */}
            <div className="mt-5 flex items-center justify-center gap-2 px-4 text-center text-[11px] leading-5 text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
              <span>
                Your connection is protected with secure authentication.
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
