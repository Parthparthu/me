export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-app)]" role="status" aria-label="Loading">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[var(--accent-primary)] animate-spin" />
        <div className="absolute inset-1.5 rounded-full border-2 border-transparent border-b-slate-600 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.2s' }} />
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
