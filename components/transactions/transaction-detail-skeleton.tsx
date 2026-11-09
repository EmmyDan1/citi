export default function TransactionDetailSkeleton() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto max-w-md px-4 pb-10">
        <header className="py-6">
          <div className="h-3 w-20 animate-pulse rounded bg-slate-200" />
          <div className="mt-2 h-8 w-48 animate-pulse rounded bg-slate-200" />
        </header>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="mx-auto h-12 w-12 animate-pulse rounded-full bg-slate-200" />

          <div className="mx-auto mt-4 h-8 w-32 animate-pulse rounded bg-slate-200" />

          <div className="mx-auto mt-2 h-4 w-24 animate-pulse rounded bg-slate-200" />

          <div className="mt-8 space-y-5">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between"
              >
                <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}