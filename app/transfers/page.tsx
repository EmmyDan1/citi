import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  ChevronRight,
  Landmark,
  Repeat2,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const transferOptions = [
  {
    href: "/transfers/internal",
    icon: Repeat2,
    title: "Between my accounts",
    description:
      "Move money between your checking and savings accounts instantly.",
    meta: "Usually instant",
  },
  {
    href: "/transfers/external",
    icon: Building2,
    title: "To another bank",
    description:
      "Send money to an external bank account using its routing and account number.",
    meta: "External transfer",
  },
];

export default function TransfersPage() {
  return (
    <main className="min-h-screen bg-northstar-background text-northstar-text">
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-8">
          <Link
            href="/"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-northstar-text-muted transition-colors hover:text-northstar-blue"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <div className="mb-3 flex items-center gap-2 text-sm text-northstar-text-muted">
            <Landmark className="h-4 w-4" />
            <span>Transfers</span>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-northstar-text sm:text-3xl">
            Move money
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-northstar-text-muted sm:text-base">
            Choose how you would like to transfer your money.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {transferOptions.map((option) => {
            const Icon = option.icon;

            return (
              <Link
                key={option.href}
                href={option.href}
                className="group block"
              >
                <Card className="h-full rounded-2xl border-northstar-border bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-northstar-blue/30 hover:shadow-md">
                  <CardContent className="p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-northstar-soft-blue text-northstar-blue">
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-northstar-border text-northstar-text-muted transition-colors group-hover:border-northstar-blue/30 group-hover:text-northstar-blue">
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>

                    <div className="mt-6">
                      <h2 className="text-lg font-semibold tracking-tight text-northstar-text">
                        {option.title}
                      </h2>

                      <p className="mt-2 text-sm leading-6 text-northstar-text-muted">
                        {option.description}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-northstar-border pt-4">
                      <span className="text-xs font-medium text-northstar-text-muted">
                        {option.meta}
                      </span>

                      <span className="flex items-center gap-1 text-sm font-medium text-northstar-blue">
                        Continue
                        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="mt-6 rounded-xl border border-northstar-border bg-white p-4 sm:p-5">
          <div className="flex gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-northstar-soft-blue">
              <Landmark className="h-4 w-4 text-northstar-blue" />
            </div>

            <div>
              <p className="text-sm font-medium text-northstar-text">
                Transfer securely
              </p>
              <p className="mt-1 text-sm leading-5 text-northstar-text-muted">
                Review your transfer details carefully before confirming any
                transaction.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}