
"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    <main className="min-h-screen bg-[#061a32] text-slate-950">
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Blue brand panel */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#032d58] via-[#07569a] to-[#0876c9] px-6 py-8 text-white lg:flex lg:w-[48%] lg:flex-col lg:justify-between lg:px-12 lg:py-10 xl:px-16">
          {/* Decorative shapes */}
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-blue-300/10 blur-3xl" />

          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/12 ring-1 ring-white/20 backdrop-blur">
                <span className="text-lg font-bold">N</span>
              </div>

              <span className="text-xl font-semibold tracking-tight">
                Northstar
              </span>
            </div>
          </div>

          <div className="relative z-10 hidden max-w-md lg:block">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-blue-100">
              Your financial dashboard
            </p>

            <h1 className="text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
              Everything you need,
              <br />
              right where you need it.
            </h1>

            <p className="mt-6 max-w-sm text-base leading-7 text-blue-100">
              Manage your accounts, review activity, and move money with a
              clear view of your finances.
            </p>

            <div className="mt-10 flex items-center gap-3 text-sm text-blue-100">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                <ShieldCheck className="h-4 w-4" />
              </div>
              Secure account access
            </div>
          </div>

          <div className="relative z-10 hidden text-xs text-blue-100/70 lg:block">
            Secure access to your accounts
          </div>
        </section>

        {/* Login area */}
        <section className="flex flex-1 items-center justify-center bg-slate-50 px-4 py-10 sm:px-6 lg:px-10">
          <div className="w-full max-w-md">
            {/* Mobile brand */}
            <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#075da8] text-white shadow-sm">
                <span className="text-lg font-bold">N</span>
              </div>

              <span className="text-xl font-semibold tracking-tight text-[#06284a]">
                Northstar
              </span>
            </div>

            <div className="mb-7">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#075da8]">
                <LockKeyhole className="h-5 w-5" />
              </div>

              <h2 className="text-3xl font-semibold tracking-tight text-[#061a32]">
                Welcome back
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Sign in to securely access your accounts and activity.
              </p>
            </div>

            <Card className="rounded-2xl border-slate-200 bg-white shadow-[0_18px_50px_-24px_rgba(6,26,50,0.35)]">
              <CardContent className="p-6 sm:p-7">
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
                      className="mt-2 h-12 rounded-xl border-slate-200 bg-white px-4 text-base shadow-none transition focus-visible:border-[#0876c9] focus-visible:ring-[#0876c9]/20"
                      autoComplete="email"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      inputMode="email"
                      placeholder="you@example.com"
                      required
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
                        onChange={(event) =>
                          setPassword(event.target.value)
                        }
                        className="h-12 rounded-xl border-slate-200 bg-white px-4 pr-12 text-base shadow-none transition focus-visible:border-[#0876c9] focus-visible:ring-[#0876c9]/20"
                        autoComplete="current-password"
                        required
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {message && (
                    <div
                      role="alert"
                      className="rounded-xl border border-red-200 bg-red-50 px-4 py-3"
                    >
                      <p className="text-sm leading-5 text-red-700">
                        {message}
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-12 w-full rounded-xl bg-[#075da8] text-sm font-semibold text-white shadow-sm transition hover:bg-[#064f91] focus-visible:ring-[#075da8]/30"
                  >
                    {loading ? (
                      "Signing in..."
                    ) : (
                      <>
                        Sign in
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6 border-t border-slate-100 pt-5">
                  <p className="text-center text-sm text-slate-500">
                    New to Northstar?{" "}
                    <Link
                      href="/register"
                      className="font-semibold text-[#075da8] underline-offset-4 hover:underline"
                    >
                      Create an account
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              Secure account authentication
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
