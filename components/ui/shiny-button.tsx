"use client";

import React, { useId } from "react";
import { cn } from "@/lib/utils";

export interface ShinyButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  shinyColor?: string;
  shinySubtleColor?: string;
}

export function ShinyButton({
  children,
  onClick,
  className = "",
  shinyColor = "var(--accent, #22D3EE)",
  shinySubtleColor = "var(--accent-hover, #67E8F9)",
  type = "button",
  ...props
}: ShinyButtonProps) {
  const uniqueId = useId().replace(/:/g, "_");
  const buttonClass = `shiny-cta-${uniqueId}`;

  const styles = `
    @property --gradient-angle-${uniqueId} {
      syntax: "<angle>";
      initial-value: 0deg;
      inherits: false;
    }

    @property --gradient-angle-offset-${uniqueId} {
      syntax: "<angle>";
      initial-value: 0deg;
      inherits: false;
    }

    @property --gradient-percent-${uniqueId} {
      syntax: "<percentage>";
      initial-value: 5%;
      inherits: false;
    }

    @property --gradient-shine-${uniqueId} {
      syntax: "<color>";
      initial-value: white;
      inherits: false;
    }

    .${buttonClass} {
      --shiny-cta-bg: var(--bg-primary, #060B18);
      --shiny-cta-bg-subtle: var(--bg-secondary, #0E1626);
      --shiny-cta-fg: var(--label-primary, #F2F5FA);
      --shiny-cta-highlight: ${shinyColor};
      --shiny-cta-highlight-subtle: ${shinySubtleColor};
      --animation: gradient-angle-${uniqueId} linear infinite;
      --duration: 3s;
      --shadow-size: 2px;
      --transition: 800ms cubic-bezier(0.25, 1, 0.5, 1);
      
      isolation: isolate;
      position: relative;
      overflow: hidden;
      cursor: pointer;
      outline-offset: 4px;
      padding: 0.875rem 2rem;
      min-height: 44px;
      font-size: 0.95rem;
      line-height: 1.25;
      font-weight: 600;
      border: 1px solid transparent;
      border-radius: 9999px;
      color: var(--shiny-cta-fg);
      background: linear-gradient(var(--shiny-cta-bg), var(--shiny-cta-bg)) padding-box,
        conic-gradient(
          from calc(var(--gradient-angle-${uniqueId}) - var(--gradient-angle-offset-${uniqueId})),
          transparent,
          var(--shiny-cta-highlight) var(--gradient-percent-${uniqueId}),
          var(--gradient-shine-${uniqueId}) calc(var(--gradient-percent-${uniqueId}) * 2),
          var(--shiny-cta-highlight) calc(var(--gradient-percent-${uniqueId}) * 3),
          transparent calc(var(--gradient-percent-${uniqueId}) * 4)
        ) border-box;
      box-shadow: inset 0 0 0 1px var(--separator, rgba(255, 255, 255, 0.1)),
                  0 4px 16px rgba(0, 0, 0, 0.35);
      transition: var(--transition);
      transition-property: --gradient-angle-offset-${uniqueId}, --gradient-percent-${uniqueId}, --gradient-shine-${uniqueId};
      touch-action: manipulation;
    }

    .${buttonClass}::before,
    .${buttonClass}::after,
    .${buttonClass} span::before {
      content: "";
      pointer-events: none;
      position: absolute;
      inset-inline-start: 50%;
      inset-block-start: 50%;
      translate: -50% -50%;
      z-index: -1;
    }

    .${buttonClass}:active {
      translate: 0 1px;
    }

    /* Dots pattern */
    .${buttonClass}::before {
      --size: calc(100% - var(--shadow-size) * 3);
      --position: 2px;
      --space: calc(var(--position) * 2);
      width: var(--size);
      height: var(--size);
      background: radial-gradient(
        circle at var(--position) var(--position),
        rgba(255, 255, 255, 0.5) calc(var(--position) / 4),
        transparent 0
      ) padding-box;
      background-size: var(--space) var(--space);
      background-repeat: space;
      mask-image: conic-gradient(
        from calc(var(--gradient-angle-${uniqueId}) + 45deg),
        black,
        transparent 10% 90%,
        black
      );
      border-radius: inherit;
      opacity: 0.35;
      z-index: -1;
    }

    /* Inner shimmer */
    .${buttonClass}::after {
      --animation: shimmer-${uniqueId} linear infinite;
      width: 100%;
      aspect-ratio: 1;
      background: linear-gradient(
        -50deg,
        transparent,
        var(--shiny-cta-highlight),
        transparent
      );
      mask-image: radial-gradient(circle at bottom, transparent 40%, black);
      opacity: 0.45;
    }

    .${buttonClass} span {
      position: relative;
      z-index: 1;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .${buttonClass} span::before {
      --size: calc(100% + 1rem);
      width: var(--size);
      height: var(--size);
      box-shadow: inset 0 -1ex 2rem 4px var(--shiny-cta-highlight);
      opacity: 0;
      transition: opacity var(--transition);
      animation: calc(var(--duration) * 1.5) breathe-${uniqueId} linear infinite;
    }

    /* Animate */
    .${buttonClass},
    .${buttonClass}::before,
    .${buttonClass}::after {
      animation: var(--animation) var(--duration),
        var(--animation) calc(var(--duration) / 0.4) reverse paused;
      animation-composition: add;
    }

    .${buttonClass}:is(:hover, :focus-visible) {
      --gradient-percent-${uniqueId}: 20%;
      --gradient-angle-offset-${uniqueId}: 95deg;
      --gradient-shine-${uniqueId}: var(--shiny-cta-highlight-subtle);
      box-shadow: inset 0 0 0 1px rgba(34, 211, 238, 0.3),
                  0 0 24px rgba(34, 211, 238, 0.25);
    }

    .${buttonClass}:is(:hover, :focus-visible),
    .${buttonClass}:is(:hover, :focus-visible)::before,
    .${buttonClass}:is(:hover, :focus-visible)::after {
      animation-play-state: running;
    }

    .${buttonClass}:is(:hover, :focus-visible) span::before {
      opacity: 1;
    }

    @keyframes gradient-angle-${uniqueId} {
      to {
        --gradient-angle-${uniqueId}: 360deg;
      }
    }

    @keyframes shimmer-${uniqueId} {
      to {
        rotate: 360deg;
      }
    }

    @keyframes breathe-${uniqueId} {
      from, to {
        scale: 1;
      }
      50% {
        scale: 1.2;
      }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <button
        type={type}
        className={cn(buttonClass, "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring,#22D3EE)]", className)}
        onClick={onClick}
        {...props}
      >
        <span>{children}</span>
      </button>
    </>
  );
}

export default ShinyButton;
