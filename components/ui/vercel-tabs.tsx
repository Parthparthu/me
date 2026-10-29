"use client";

import * as React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

export interface Tab {
  id: string;
  label: string;
  count?: number;
}

export const DEFAULT_PORTFOLIO_TABS: Tab[] = [
  { id: "all", label: "All Work" },
  { id: "flagship", label: "Flagship" },
  { id: "web-pwa", label: "Web & PWA" },
  { id: "data-ai", label: "Data & Systems" },
  { id: "tools", label: "Utilities" },
];

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  tabs?: Tab[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      className,
      tabs = DEFAULT_PORTFOLIO_TABS,
      activeTab,
      onTabChange,
      ...props
    },
    ref
  ) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const initialIndex = React.useMemo(() => {
      if (!activeTab) return 0;
      const found = tabs.findIndex((t) => t.id === activeTab);
      return found !== -1 ? found : 0;
    }, [activeTab, tabs]);

    const [activeIndex, setActiveIndex] = useState(initialIndex);
    const [hoverStyle, setHoverStyle] = useState<React.CSSProperties>({});
    const [activeStyle, setActiveStyle] = useState<React.CSSProperties>({
      left: "0px",
      width: "0px",
    });

    const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

    // Sync with controlled prop if passed
    useEffect(() => {
      if (activeTab) {
        const found = tabs.findIndex((t) => t.id === activeTab);
        if (found !== -1) setActiveIndex(found);
      }
    }, [activeTab, tabs]);

    // Update hover pill geometry
    useEffect(() => {
      if (hoveredIndex !== null) {
        const hoveredElement = tabRefs.current[hoveredIndex];
        if (hoveredElement) {
          const { offsetLeft, offsetWidth } = hoveredElement;
          setHoverStyle({
            left: `${offsetLeft}px`,
            width: `${offsetWidth}px`,
          });
        }
      }
    }, [hoveredIndex]);

    // Update active underline geometry
    const updateActiveIndicator = useCallback(() => {
      const activeElement = tabRefs.current[activeIndex];
      if (activeElement) {
        const { offsetLeft, offsetWidth } = activeElement;
        setActiveStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        });
      }
    }, [activeIndex]);

    useEffect(() => {
      updateActiveIndicator();
    }, [updateActiveIndicator]);

    useEffect(() => {
      const raf = requestAnimationFrame(() => {
        updateActiveIndicator();
      });
      window.addEventListener("resize", updateActiveIndicator);
      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", updateActiveIndicator);
      };
    }, [updateActiveIndicator]);

    const handleSelect = (index: number) => {
      setActiveIndex(index);
      const tab = tabs[index];
      if (tab) onTabChange?.(tab.id);
    };

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
      let nextIndex: number | null = null;

      if (e.key === "ArrowRight") {
        nextIndex = (index + 1) % tabs.length;
      } else if (e.key === "ArrowLeft") {
        nextIndex = (index - 1 + tabs.length) % tabs.length;
      } else if (e.key === "Home") {
        nextIndex = 0;
      } else if (e.key === "End") {
        nextIndex = tabs.length - 1;
      }

      if (nextIndex !== null) {
        e.preventDefault();
        handleSelect(nextIndex);
        tabRefs.current[nextIndex]?.focus();
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-x-auto no-scrollbar py-2 max-w-full",
          className
        )}
        {...props}
      >
        <div
          role="tablist"
          aria-label="Filter navigation"
          className="relative inline-flex items-center min-w-full sm:min-w-0"
        >
          {/* Hover Highlight Pill */}
          <div
            className="pointer-events-none absolute h-[34px] rounded-[var(--radius-sm,8px)] bg-[var(--bg-hover,rgba(255,255,255,0.06))] transition-all duration-200 ease-out"
            style={{
              ...hoverStyle,
              opacity: hoveredIndex !== null ? 1 : 0,
            }}
            aria-hidden="true"
          />

          {/* Active Indicator Underline */}
          <div
            className="pointer-events-none absolute bottom-[-4px] h-[2px] bg-[var(--accent,#22D3EE)] rounded-full transition-all duration-300 ease-out shadow-[0_0_8px_var(--accent,#22D3EE)]"
            style={activeStyle}
            aria-hidden="true"
          />

          {/* Tab buttons */}
          <div className="relative flex space-x-1 items-center">
            {tabs.map((tab, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  key={tab.id}
                  ref={(el) => {
                    tabRefs.current[index] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`tab-${tab.id}`}
                  aria-selected={isActive}
                  aria-controls={`panel-${tab.id}`}
                  tabIndex={isActive ? 0 : -1}
                  className={cn(
                    "relative px-3.5 py-1.5 h-[34px] cursor-pointer rounded-[var(--radius-sm,8px)] transition-colors duration-200",
                    "text-xs sm:text-sm font-medium tracking-tight whitespace-nowrap flex items-center gap-1.5",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring,#22D3EE)] touch-action-manipulation",
                    isActive
                      ? "text-[var(--label-primary,#F2F5FA)] font-semibold"
                      : "text-[var(--label-secondary,#A9B4C7)] hover:text-[var(--label-primary,#F2F5FA)]"
                  )}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => handleSelect(index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                >
                  <span>{tab.label}</span>
                  {typeof tab.count === "number" && (
                    <span
                      className={cn(
                        "text-[10px] font-mono px-1.5 py-0.5 rounded-full",
                        isActive
                          ? "bg-[var(--accent,#22D3EE)]/20 text-[var(--accent,#22D3EE)]"
                          : "bg-[var(--separator,rgba(255,255,255,0.08))] text-[var(--label-tertiary,#8090AB)]"
                      )}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
);

Tabs.displayName = "Tabs";

export { Tabs };
export default Tabs;
