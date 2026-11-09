"use client";

import Link from "next/link";
import { useState } from "react";
import { Loader2 } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const supabase = createClient();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          display_name: `${firstName} ${lastName}`.trim(),
        },
      },
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setMessage(
      "Registration successful. Check your email if email confirmation is enabled."
    );

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center">
        <div className="w-full">
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold tracking-[0.18em] text-slate-500">
              DEMONSTRATION ENVIRONMENT
            </p>

            <h1 className="mt-3 text-2xl font-semibold tracking-tight">
              Create your account
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Create a demo banking profile to continue.
            </p>
          </div>

          <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6">
              <form onSubmit={handleRegister} className="space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="firstName">First name</Label>

                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(event) => setFirstName(event.target.value)}
                      className="mt-2 h-11 rounded-xl"
                      autoComplete="given-name"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="lastName">Last name</Label>

                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(event) => setLastName(event.target.value)}
                      className="mt-2 h-11 rounded-xl"
                      autoComplete="family-name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email address</Label>

                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="mt-2 h-11 rounded-xl"
                    autoComplete="email"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>

                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="mt-2 h-11 rounded-xl"
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />

                  <p className="mt-1.5 text-xs text-slate-400">
                    Use at least 8 characters.
                  </p>
                </div>

                {message && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-sm leading-5 text-slate-600">
                      {message}
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="h-11 w-full rounded-xl"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create account"
                  )}
                </Button>
              </form>

              <div className="mt-6 border-t border-slate-100 pt-5 text-center">
                <p className="text-sm text-slate-500">
                  Already have a demo account?{" "}
                  <Link
                    href="/login"
                    className="font-medium text-slate-900 underline underline-offset-4"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-[11px] leading-5 text-slate-400">
            This application is fictional and does not connect to real bank
            accounts, payment networks, or financial institutions.
          </p>
        </div>
      </div>
    </main>
  );
}