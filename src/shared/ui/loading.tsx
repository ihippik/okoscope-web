export function Loading({ label = 'Loading…' }: { label?: string }) {
  return (
    <div
      aria-live="polite"
      className="rounded-xl border border-slate-800 bg-slate-900/60 p-8 text-center text-slate-300"
    >
      {label}
    </div>
  )
}
