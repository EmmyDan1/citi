export default function WelcomeSummary({
  firstName,
  totalAvailable,
}: {
  firstName: string;
  totalAvailable: number;
}) {
  const formattedTotal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(totalAvailable);

  return (
    <div className="pb-7 pt-7 sm:pb-9 sm:pt-9">
      <p className="text-sm text-white/65">Welcome</p>

      <div className="mt-1 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {firstName}
          </h1>

          <p className="mt-2 text-sm text-white/65">
            Your banking at a glance.
          </p>
        </div>

        <div className="sm:text-right">
          <p className="text-xs text-white/60">
            Total available
          </p>

          <p className="mt-1 text-xl font-semibold text-white">
            {formattedTotal}
          </p>
        </div>
      </div>
    </div>
  );
}