export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-app)]" role="status" aria-label="Loading">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-t-2 border-[var(--brand-cobalt)] animate-spin" />
        <div className="absolute inset-2 rounded-full border-b-2 border-[var(--brand-cyan)] animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
