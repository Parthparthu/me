import React from 'react';
import { 
  ShieldCheck, 
  Terminal, 
  Check, 
  Wifi, 
  Layers,
  Smartphone,
  Split
} from 'lucide-react';

interface ProjectVisualizerProps {
  slug: string;
}

export const ProjectVisualizer: React.FC<ProjectVisualizerProps> = ({ slug }) => {
  switch (slug) {
    case 'oweo':
      return (
        <div className="spatial-visualizer oweo-visualizer" aria-label="Oweo offline expense & debt splitting preview">
          {/* Top Bar */}
          <div className="vis-header">
            <div className="vis-badge-group">
              <span className="vis-dot vis-dot-emerald" />
              <span className="vis-badge-text">Offline-First PWA · Zustand v5</span>
            </div>
            <div className="vis-connection-status" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Smartphone size={12} style={{ color: 'var(--brand-cyan)' }} aria-hidden="true" />
              <span>Mobile-First 100dvh</span>
            </div>
          </div>

          {/* Heuristic Parser Screen */}
          <div className="numora-screen" style={{ gap: 'var(--space-3)' }}>
            <div className="oweo-parser-input" style={{
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(0, 240, 255, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-2-5) var(--space-3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 'var(--text-xs)',
              fontFamily: 'var(--font-mono)',
            }}>
              <span style={{ color: '#f8fafc' }}>&quot;Dinner ₹1,200 with Rahul &amp; Priya&quot;</span>
              <span style={{
                fontSize: '10px',
                padding: '2px 6px',
                borderRadius: 'var(--radius-xs)',
                background: 'rgba(79, 107, 255, 0.2)',
                color: 'var(--brand-cyan)',
                border: '1px solid rgba(0, 240, 255, 0.3)',
              }}>NLP Heuristic</span>
            </div>

            {/* Parsed Attributes Strip */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 'var(--space-2)',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
            }}>
              <div style={{ background: 'var(--bg-app)', padding: '6px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-tertiary)', display: 'block', fontSize: '10px' }}>Total</span>
                <strong style={{ color: 'var(--brand-sky)' }}>₹1,200.00</strong>
              </div>
              <div style={{ background: 'var(--bg-app)', padding: '6px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-tertiary)', display: 'block', fontSize: '10px' }}>Split</span>
                <strong style={{ color: '#f8fafc' }}>3 Members</strong>
              </div>
              <div style={{ background: 'var(--bg-app)', padding: '6px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-tertiary)', display: 'block', fontSize: '10px' }}>Each Pays</span>
                <strong style={{ color: '#22c55e' }}>₹400 / head</strong>
              </div>
            </div>

            {/* Debt Minimization Graph Algorithm Preview */}
            <div className="numora-pattern-box" style={{ borderColor: 'rgba(79, 107, 255, 0.3)' }}>
              <div className="numora-pattern-title">
                <Split size={13} style={{ color: 'var(--brand-cyan)' }} aria-hidden="true" />
                <span>Debt Minimization Graph Engine</span>
              </div>
              <div className="numora-pattern-tags">
                <span className="numora-tag-ok">4 Circular Debts → 1 Direct UPI</span>
                <span className="numora-tag-rule">Zero Redundant Settlements</span>
              </div>
            </div>
          </div>
        </div>
      );

    case 'numora':
      return (
        <div className="spatial-visualizer numora-visualizer" aria-label="Numora calculation and pattern engine preview">
          {/* Top Bar */}
          <div className="vis-header">
            <div className="vis-badge-group">
              <span className="vis-dot vis-dot-emerald" />
              <span className="vis-badge-text">PWA Pure Engine</span>
            </div>
            <span className="vis-mono-meta">0ms Network Latency</span>
          </div>

          {/* Number Input Mockup */}
          <div className="numora-screen">
            <div className="numora-phone-field">
              <span className="numora-country-code">+91</span>
              <span className="numora-digits">98102 <mark className="numora-forbidden-match">35</mark> 821</span>
            </div>

            {/* Reduction Steps */}
            <div className="numora-pipeline">
              <div className="numora-step">
                <span className="numora-step-label">Single-Digit Reduction</span>
                <div className="numora-sum-flow">
                  <span>∑(9+8+1+0+2+3+5+8+2+1)</span>
                  <span className="numora-arrow">→</span>
                  <span className="numora-badge-num">39</span>
                  <span className="numora-arrow">→</span>
                  <strong className="numora-final-num">3</strong>
                </div>
              </div>

              {/* 43 Forbidden Pattern Rule Match */}
              <div className="numora-pattern-box">
                <div className="numora-pattern-title">
                  <ShieldCheck size={13} style={{ color: 'var(--accent-rose)' }} aria-hidden="true" />
                  <span>Directional Scan Matrix</span>
                </div>
                <div className="numora-pattern-tags">
                  <span className="numora-tag-match">Match: Pair [35]</span>
                  <span className="numora-tag-rule">Rule 43-B Active</span>
                  <span className="numora-tag-ok">Total [3] Validated</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'insidertracker':
      return (
        <div className="spatial-visualizer insider-visualizer" aria-label="SEC EDGAR Form 4 live transaction stream preview">
          <div className="vis-header">
            <div className="vis-badge-group">
              <span className="vis-dot vis-dot-cyan" />
              <span className="vis-badge-text">SEC EDGAR XML Feed</span>
            </div>
            <span className="vis-mono-meta">Automated Poller</span>
          </div>

          <div className="insider-table">
            <div className="insider-row insider-row--highlight">
              <div className="insider-ticker-box">
                <span className="insider-ticker">NVDA</span>
                <span className="insider-role">Director</span>
              </div>
              <div className="insider-action insider-action--buy">BUY</div>
              <div className="insider-amount">
                <span className="insider-shares">15,000 shares</span>
                <strong className="insider-value">$1,875,000</strong>
              </div>
              <span className="insider-alert-pill">&gt;$500K Alert</span>
            </div>

            <div className="insider-row">
              <div className="insider-ticker-box">
                <span className="insider-ticker">AAPL</span>
                <span className="insider-role">CFO</span>
              </div>
              <div className="insider-action insider-action--sell">SELL</div>
              <div className="insider-amount">
                <span className="insider-shares">4,200 shares</span>
                <span className="insider-value">$945,000</span>
              </div>
              <span className="insider-alert-pill">&gt;$500K Alert</span>
            </div>

            <div className="insider-row">
              <div className="insider-ticker-box">
                <span className="insider-ticker">MSFT</span>
                <span className="insider-role">Exec VP</span>
              </div>
              <div className="insider-action insider-action--buy">BUY</div>
              <div className="insider-amount">
                <span className="insider-shares">1,500 shares</span>
                <span className="insider-value">$615,000</span>
              </div>
              <span className="insider-alert-pill">&gt;$500K Alert</span>
            </div>
          </div>
        </div>
      );

    case 'codeclash-ai':
      return (
        <div className="spatial-visualizer codeclash-visualizer" aria-label="1v1 competitive coding and FastAPI evaluation preview">
          <div className="vis-header">
            <div className="vis-badge-group">
              <span className="vis-dot vis-dot-violet" />
              <span className="vis-badge-text">1v1 Real-Time Battle</span>
            </div>
            <div className="vis-connection-status">
              <Wifi size={12} style={{ color: 'var(--accent-emerald)' }} aria-hidden="true" />
              <span>Supabase Sync</span>
            </div>
          </div>

          <div className="codeclash-terminals">
            {/* Player Terminal */}
            <div className="codeclash-pane">
              <div className="codeclash-pane-header">
                <Terminal size={12} aria-hidden="true" />
                <span>main.py — Solution</span>
                <span className="codeclash-status-pass">
                  <Check size={11} aria-hidden="true" /> Pass
                </span>
              </div>
              <pre className="codeclash-code">
{`def solve(grid: list[list[int]]) -> int:
    m, n = len(grid), len(grid[0])
    dp = [0] * n
    for r in range(m):
        for c in range(n):
            ...`}
              </pre>
            </div>

            {/* FastAPI Evaluation Telemetry */}
            <div className="codeclash-telemetry">
              <div className="telemetry-item">
                <span className="telemetry-label">Evaluator:</span>
                <span className="telemetry-val">FastAPI Microservice</span>
              </div>
              <div className="telemetry-item">
                <span className="telemetry-label">Test Suite:</span>
                <span className="telemetry-val" style={{ color: 'var(--accent-emerald)' }}>12/12 Passed</span>
              </div>
              <div className="telemetry-item">
                <span className="telemetry-label">Exec Time:</span>
                <span className="telemetry-val">38ms (Bounded)</span>
              </div>
            </div>
          </div>
        </div>
      );

    case 'stockscreener':
      return (
        <div className="spatial-visualizer stockscreener-visualizer" aria-label="Real-time stock screener WebSocket feed preview">
          <div className="vis-header">
            <div className="vis-badge-group">
              <span className="vis-dot vis-dot-emerald" />
              <span className="vis-badge-text">WebSocket Pipeline</span>
            </div>
            <span className="vis-mono-meta">NSE 500 &amp; NYSE</span>
          </div>

          <div className="stockscreener-grid">
            <div className="screener-card">
              <div className="screener-card-header">
                <span className="screener-ticker">RELIANCE.NS</span>
                <span className="screener-signal">SMA Cross</span>
              </div>
              <div className="screener-metrics">
                <div><span>RSI:</span> <strong>64.2</strong></div>
                <div><span>Vol:</span> <strong>2.8x</strong></div>
                <div style={{ color: 'var(--accent-emerald)' }}>▲ +2.4%</div>
              </div>
            </div>

            <div className="screener-card">
              <div className="screener-card-header">
                <span className="screener-ticker">TCS.NS</span>
                <span className="screener-signal">Breakout</span>
              </div>
              <div className="screener-metrics">
                <div><span>RSI:</span> <strong>58.9</strong></div>
                <div><span>Vol:</span> <strong>1.9x</strong></div>
                <div style={{ color: 'var(--accent-emerald)' }}>▲ +1.8%</div>
              </div>
            </div>

            <div className="screener-card">
              <div className="screener-card-header">
                <span className="screener-ticker">AMD (NYSE)</span>
                <span className="screener-signal">Momentum</span>
              </div>
              <div className="screener-metrics">
                <div><span>RSI:</span> <strong>71.1</strong></div>
                <div><span>Vol:</span> <strong>3.1x</strong></div>
                <div style={{ color: 'var(--accent-emerald)' }}>▲ +4.6%</div>
              </div>
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className="spatial-visualizer default-visualizer" aria-label="Architecture schematic layout">
          <div className="vis-header">
            <div className="vis-badge-group">
              <Layers size={13} style={{ color: 'var(--accent-primary)' }} aria-hidden="true" />
              <span className="vis-badge-text">Full-Stack Contract</span>
            </div>
            <span className="vis-mono-meta">Verified Implementation</span>
          </div>
          <div className="default-schematic">
            <div className="schematic-node">Client (React / Next.js)</div>
            <div className="schematic-flow">↓ REST / WebSocket API</div>
            <div className="schematic-node">Backend Microservice (FastAPI / SQLite / Supabase)</div>
            <div className="schematic-flow">↓ Strict Validation &amp; Storage</div>
            <div className="schematic-node">Persistent Storage / In-Memory Cache</div>
          </div>
        </div>
      );
  }
};
