/**
 * SceneFallback: Clean, static, non-animated geometric gradient backdrop.
 * Rendered immediately on first paint while 3D canvas loads in the background,
 * and serves as the permanent fallback when WebGL is unavailable.
 * Reserves full-viewport fixed space with zero layout shift.
 */
export function SceneFallback() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-30 select-none"
    >
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute top-2/3 left-1/3 w-80 h-80 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)',
        }}
      />
    </div>
  );
}
