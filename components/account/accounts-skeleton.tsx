import { Card, CardContent } from "@/components/ui/card";

export default function AccountsSkeleton() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto max-w-md px-4 pb-10">
        <header className="py-6">
          <div className="h-3 w-16 animate-pulse rounded bg-slate-200" />
          <div className="mt-2 h-8 w-32 animate-pulse rounded bg-slate-200" />
        </header>

        <Card className="rounded-2xl border-0 bg-slate-200 shadow-lg">
          <CardContent className="p-5">
            <div className="h-4 w-24 animate-pulse rounded bg-slate-300" />
            <div className="mt-3 h-9 w-40 animate-pulse rounded bg-slate-300" />

            <div className="mt-6 flex items-center justify-between">
              <div>
                <div className="h-3 w-24 animate-pulse rounded bg-slate-300" />
                <div className="mt-2 h-4 w-28 animate-pulse rounded bg-slate-300" />
              </div>

              <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-300" />
            </div>
          </CardContent>
        </Card>

        <section className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <div className="h-5 w-24 animate-pulse rounded bg-slate-200" />
            <div className="h-3 w-16 animate-pulse rounded bg-slate-200" />
          </div>

          <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
            <CardContent className="p-0">
              {[1, 2].map((item) => (
                <div key={item}>
                  <div className="flex items-center gap-3 px-4 py-5">
                    <div className="h-11 w-11 shrink-0 animate-pulse rounded-xl bg-slate-200" />

                    <div className="min-w-0 flex-1">
                      <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
                      <div className="mt-2 h-3 w-20 animate-pulse rounded bg-slate-200" />
                      <div className="mt-3 h-3 w-28 animate-pulse rounded bg-slate-200" />
                    </div>

                    <div>
                      <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
                      <div className="ml-auto mt-3 h-4 w-4 animate-pulse rounded bg-slate-200" />
                    </div>
                  </div>

                  {item === 1 && (
                    <div className="mx-4 border-t border-slate-100" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}