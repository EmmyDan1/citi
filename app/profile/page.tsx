
"use client";
import {
  Bell,
  ChevronRight,
  FileText,
  LockKeyhole,
  LogOut,
  Settings,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";

const settings = [
  {
    icon: UserRound,
    title: "Personal information",
    description: "Name, email and contact details",
  },
  {
    icon: ShieldCheck,
    title: "Security",
    description: "Password and account security",
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Manage account alerts",
  },
  {
    icon: LockKeyhole,
    title: "Privacy",
    description: "Privacy and data preferences",
  },
  {
    icon: FileText,
    title: "Statements",
    description: "View account statements",
  },
  {
    icon: Settings,
    title: "Preferences",
    description: "Application preferences",
  },
];

export default function ProfilePage() {
  const supabase = createClient();

  const [firstName, setFirstName] = useState("Customer");
  const [displayName, setDisplayName] = useState("Customer");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      setEmail(user.email ?? "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("first_name, display_name")
        .eq("id", user.id)
        .single();

      setFirstName(
        profile?.first_name ||
          profile?.display_name ||
          user.email?.split("@")[0] ||
          "Customer"
      );

      setDisplayName(
        profile?.display_name ||
          profile?.first_name ||
          user.email?.split("@")[0] ||
          "Customer"
      );

      setLoading(false);
    }

    loadProfile();
  }, [supabase]);

  async function handleSignOut() {
    setSigningOut(true);

    await supabase.auth.signOut();

    window.location.href = "/login";
  }

  const initials = displayName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto max-w-md px-4 pb-10">
        <header className="py-6">
          <p className="text-xs font-medium text-slate-500">Account</p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            Profile
          </h1>
        </header>

        <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
          <CardContent className="p-5">
            {loading ? (
              <div className="h-16 animate-pulse rounded-xl bg-slate-100" />
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-900 text-lg font-semibold text-white">
                  {initials}
                </div>

                <div className="min-w-0">
                  <h2 className="truncate text-base font-semibold">
                    {displayName}
                  </h2>

                  <p className="mt-1 truncate text-sm text-slate-500">
                    {email}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Customer since 1991
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <section className="mt-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Account settings
          </p>

          <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
            <CardContent className="p-0">
              {settings.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div key={item.title}>
                    <button className="flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-slate-50">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                        <Icon className="h-4 w-4 text-slate-700" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{item.title}</p>

                        <p className="mt-0.5 truncate text-xs text-slate-500">
                          {item.description}
                        </p>
                      </div>

                      <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
                    </button>

                    {index < settings.length - 1 && <Separator />}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </section>

        <button
          type="button"
          onClick={handleSignOut}
          disabled={signingOut}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <LogOut className="h-4 w-4" />

          {signingOut ? "Signing out..." : "Sign out"}
        </button>
      </div>
    </main>
  );
}
