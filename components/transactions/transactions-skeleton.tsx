export default function TransactionsSkeleton() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto max-w-md px-4 pb-10">
        <header className="py-6">
          <div className="h-3 w-16 animate-pulse rounded bg-slate-200" />
          <div className="mt-2 h-8 w-40 animate-pulse rounded bg-slate-200" />
        </header>

        <div className="space-y-3">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-2xl bg-white px-4 py-5 shadow-sm"
            >
              <div className="h-11 w-11 animate-pulse rounded-xl bg-slate-200" />

              <div className="min-w-0 flex-1">
                <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
                <div className="mt-2 h-3 w-24 animate-pulse rounded bg-slate-200" />
              </div>

              <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}