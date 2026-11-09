export default function DashboardSkeleton() {
  return (
    <main className="min-h-screen bg-[#061a32]">
      <section className="bg-gradient-to-b from-[#063b70] via-[#064b8c] to-[#075da8]">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="h-16 border-b border-white/10" />

          <div className="py-3">
            <div className="h-5 w-32 animate-pulse rounded bg-white/10" />
          </div>

          <div className="pb-9 pt-9">
            <div className="h-4 w-20 animate-pulse rounded bg-white/10" />

            <div className="mt-3 h-9 w-48 animate-pulse rounded bg-white/10" />

            <div className="mt-3 h-4 w-64 animate-pulse rounded bg-white/10" />
          </div>
        </div>
      </section>

      <section className="bg-[#061a32]">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="h-5 w-24 animate-pulse rounded bg-white/10" />

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="h-52 animate-pulse rounded-2xl bg-white/10" />
            <div className="h-52 animate-pulse rounded-2xl bg-white/10" />
          </div>

          <div className="mt-8 h-48 animate-pulse rounded-2xl bg-white/10" />
        </div>
      </section>
    </main>
  );
}