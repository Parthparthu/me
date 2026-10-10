'use client';

import { Printer } from 'lucide-react';

export function PrintResumeButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[8px] bg-[var(--accent-primary)] text-white text-xs font-semibold shadow-sm hover:bg-[var(--accent-hover)] transition-colors min-h-[44px] cursor-pointer"
      aria-label="Print or save curriculum vitae as PDF"
    >
      <Printer size={14} />
      <span>Print / Save CV</span>
    </button>
  );
}
