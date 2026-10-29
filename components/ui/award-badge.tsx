"use client";

import React, { MouseEvent, useEffect, useRef, useState, useId } from "react";
import { cn } from "@/lib/utils";

export type AwardBadgeType =
  | "golden-kitty"
  | "product-of-the-day"
  | "product-of-the-month"
  | "product-of-the-week"
  | "wmc-medal"
  | "logic-championship";

export interface AwardBadgeProps {
  type?: AwardBadgeType;
  place?: number;
  link?: string;
  customTitle?: string;
  customOrganization?: string;
  className?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

const identityMatrix =
  "1, 0, 0, 0, " +
  "0, 1, 0, 0, " +
  "0, 0, 1, 0, " +
  "0, 0, 0, 1";

const backgroundColor = ["#f3e3ac", "#e2e8f0", "#f1cfa6", "#cffafe"];

const titleMap: Record<AwardBadgeType, string> = {
  "golden-kitty": "Golden Kitty Awards",
  "product-of-the-day": "Product of the Day",
  "product-of-the-month": "Product of the Month",
  "product-of-the-week": "Product of the Week",
  "wmc-medal": "World Memory Champ",
  "logic-championship": "Logic Champion",
};

const orgMap: Record<AwardBadgeType, string> = {
  "golden-kitty": "PRODUCT HUNT",
  "product-of-the-day": "PRODUCT HUNT",
  "product-of-the-month": "PRODUCT HUNT",
  "product-of-the-week": "PRODUCT HUNT",
  "wmc-medal": "IAM WORLD CHAMPIONSHIP",
  "logic-championship": "WHITEHAT JR",
};

/**
 * Computes a mathematically correct 4x4 3D rotation and scale matrix
 * based on normalized cursor position (-1 to +1).
 */
function computeEulerMatrix(normX: number, normY: number, scale = 1.0): string {
  // Max tilt angles: ~10deg on X (pitch), ~14deg on Y (yaw)
  const maxTiltX = 0.175;
  const maxTiltY = 0.245;

  const rx = -normY * maxTiltX;
  const ry = normX * maxTiltY;

  const cosX = Math.cos(rx);
  const sinX = Math.sin(rx);
  const cosY = Math.cos(ry);
  const sinY = Math.sin(ry);

  // Column 1 (X axis projection)
  const m11 = (cosY * scale).toFixed(6);
  const m12 = (0).toFixed(6);
  const m13 = (-sinY * scale).toFixed(6);
  const m14 = "0";

  // Column 2 (Y axis projection)
  const m21 = (sinX * sinY * scale).toFixed(6);
  const m22 = (cosX * scale).toFixed(6);
  const m23 = (sinX * cosY * scale).toFixed(6);
  const m24 = "0";

  // Column 3 (Z axis projection)
  const m31 = (cosX * sinY * scale).toFixed(6);
  const m32 = (-sinX * scale).toFixed(6);
  const m33 = (cosX * cosY * scale).toFixed(6);
  const m34 = "0";

  // Column 4 (Translation & Homogeneous coordinate)
  const m41 = "0";
  const m42 = "0";
  const m43 = "0";
  const m44 = "1";

  return `${m11}, ${m12}, ${m13}, ${m14}, ${m21}, ${m22}, ${m23}, ${m24}, ${m31}, ${m32}, ${m33}, ${m34}, ${m41}, ${m42}, ${m43}, ${m44}`;
}

export const AwardBadge = ({
  type = "product-of-the-day",
  place = 1,
  link = "https://www.producthunt.com",
  customTitle,
  customOrganization,
  className,
  onClick,
}: AwardBadgeProps) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const rafRef = useRef<number | null>(null);

  const [matrix, setMatrix] = useState<string>(identityMatrix);
  const [overlayPosition, setOverlayPosition] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  const uniqueId = useId().replace(/:/g, "_");

  // Check for prefers-reduced-motion
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const updateCoordinates = (clientX: number, clientY: number) => {
    if (!ref.current || reducedMotion) return;
    const rect = ref.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    // Relative offset from center normalized between -1.0 and +1.0
    const halfW = rect.width / 2;
    const halfH = rect.height / 2;
    const relX = (clientX - (rect.left + halfW)) / halfW;
    const relY = (clientY - (rect.top + halfH)) / halfH;

    const normX = Math.max(-1, Math.min(1, relX));
    const normY = Math.max(-1, Math.min(1, relY));

    // Update 3D perspective matrix
    const newMatrix = computeEulerMatrix(normX, normY, 1.025);
    setMatrix(newMatrix);

    // Update chromatic sheen angle: smoothly sweeps from -32deg to +32deg
    const newAngle = normX * 32 + normY * 12;
    setOverlayPosition(newAngle);
  };

  const onMouseEnter = (e: MouseEvent<HTMLAnchorElement>) => {
    if (reducedMotion) return;
    setIsHovered(true);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      updateCoordinates(e.clientX, e.clientY);
    });
  };

  const onMouseMove = (e: MouseEvent<HTMLAnchorElement>) => {
    if (reducedMotion) return;
    const clientX = e.clientX;
    const clientY = e.clientY;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      updateCoordinates(clientX, clientY);
    });
  };

  const onMouseLeave = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setIsHovered(false);
    setMatrix(identityMatrix);
    setOverlayPosition(0);
  };

  // 10 prismatic iridescent slices spanning visible spectrum
  const overlayHues = [
    "hsl(358, 100%, 65%)",
    "hsl(30, 100%, 55%)",
    "hsl(55, 100%, 50%)",
    "hsl(135, 75%, 45%)",
    "hsl(215, 88%, 55%)",
    "hsl(270, 85%, 55%)",
    "hsl(315, 75%, 50%)",
    "rgba(255, 255, 255, 0.4)",
    "rgba(255, 255, 255, 0.6)",
    "rgba(255, 255, 255, 0.8)",
  ];

  // Subtle ambient shimmer keyframes when idle
  const overlayAnimations = [...Array(10).keys()]
    .map(
      (e) => `
    @keyframes overlayAnimation_${uniqueId}_${e + 1} {
      0% { transform: rotate(${e * 10}deg); }
      50% { transform: rotate(${e * 10 + 10}deg); }
      100% { transform: rotate(${e * 10}deg); }
    }
    `
    )
    .join(" ");

  const displayTitle = customTitle || titleMap[type] || "Engineering Award";
  const displayOrg = customOrganization || orgMap[type] || "DISTINCTION";
  const badgeBg = backgroundColor[(place - 1) % backgroundColor.length] || backgroundColor[0];

  const isExternalLink = link.startsWith("http://") || link.startsWith("https://");

  return (
    <a
      ref={ref}
      href={link}
      target={isExternalLink ? "_blank" : undefined}
      rel={isExternalLink ? "noopener noreferrer" : undefined}
      onClick={onClick}
      className={cn(
        "group relative block w-[200px] sm:w-[260px] h-auto cursor-pointer select-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring,#22D3EE)] focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-[10px]",
        className
      )}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onMouseEnter={onMouseEnter}
      aria-label={`${displayTitle} - ${displayOrg}`}
    >
      <style dangerouslySetInnerHTML={{ __html: overlayAnimations }} />
      <div
        style={{
          transform: reducedMotion ? "none" : `perspective(700px) matrix3d(${matrix})`,
          transformOrigin: "center center",
          transition: reducedMotion
            ? "none"
            : isHovered
            ? "transform 90ms cubic-bezier(0.2, 0, 0, 1)"
            : "transform 450ms cubic-bezier(0.16, 1, 0.3, 1)",
          willChange: "transform",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 260 54"
          className="w-full h-auto drop-shadow-md transition-shadow duration-300 group-hover:drop-shadow-xl"
        >
          <defs>
            <filter id={`blur1_${uniqueId}`}>
              <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" />
            </filter>
            <mask id={`badgeMask_${uniqueId}`}>
              <rect width="260" height="54" fill="white" rx="10" />
            </mask>
          </defs>

          {/* Badge solid base */}
          <rect
            width="260"
            height="54"
            rx="10"
            fill={badgeBg}
          />

          {/* Embossed inner inset border */}
          <rect
            x="3.5"
            y="3.5"
            width="253"
            height="47"
            rx="8"
            fill="transparent"
            stroke="rgba(0,0,0,0.12)"
            strokeWidth="1"
          />

          {/* Organization / Awarding Body Header */}
          <text
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Display', Inter, sans-serif"
            fontSize="8.5"
            fontWeight="700"
            letterSpacing="0.07em"
            fill="#334155"
            x="53"
            y="20"
          >
            {displayOrg}
          </text>

          {/* Award Title & Rank */}
          <text
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Display', Inter, sans-serif"
            fontSize={displayTitle.length > 20 ? "12" : "13.5"}
            fontWeight="700"
            fill="#0f172a"
            x="52"
            y="39"
          >
            {displayTitle}{place ? ` #${place}` : ""}
          </text>

          {/* Wreath / Laurel Ribbon Glyph */}
          <g transform="translate(10, 11)" className="pointer-events-none">
            <path
              fill="#0f172a"
              d="M14.963 9.075c.787-3-.188-5.887-.188-5.887S12.488 5.175 11.7 8.175c-.787 3 .188 5.887.188 5.887s2.25-1.987 3.075-4.987m-4.5 1.987c.787 3-.188 5.888-.188 5.888S7.988 14.962 7.2 11.962c-.787-3 .188-5.887.188-5.887s2.287 1.987 3.075 4.987m.862 10.388s-.6-2.962-2.775-5.175C6.337 14.1 3.375 13.5 3.375 13.5s.6 2.962 2.775 5.175c2.213 2.175 5.175 2.775 5.175 2.775m3.3 3.413s-1.988-2.288-4.988-3.075-5.887.187-5.887.187 1.987 2.287 4.988 3.075c3 .787 5.887-.188 5.887-.188Zm6.75 0s1.988-2.288 4.988-3.075c3-.826 5.887.187 5.887.187s-1.988 2.287-4.988 3.075c-3 .787-5.887-.188-5.887-.188ZM32.625 13.5s-2.963.6-5.175 2.775c-2.213 2.213-2.775 5.175-2.775 5.175s2.962-.6 5.175-2.775c2.175-2.213 2.775-5.175 2.775-5.175M28.65 6.075s.975 2.887.188 5.887c-.826 3-3.076 4.988-3.076 4.988s-.974-2.888-.187-5.888c.788-3 3.075-4.987 3.075-4.987m-4.5 7.987s.975-2.887.188-5.887c-.788-3-3.076-4.988-3.076-4.988s-.974 2.888-.187 5.888c.788 3 3.075 4.988 3.075 4.988ZM18 26.1c.975-.225 3.113-.6 5.325 0 3 .788 5.063 3.038 5.063 3.038s-2.888.975-5.888.187a13 13 0 0 1-1.425-.525c.563.788 1.125 1.425 2.288 1.913l-.863 2.062c-2.063-.862-2.925-2.137-3.675-3.262-.262-.375-.525-.713-.787-1.05-.26.293-.465.586-.686.903l-.102.147-.048.068c-.775 1.108-1.643 2.35-3.627 3.194l-.862-2.062c1.162-.488 1.725-1.125 2.287-1.913-.45.225-.938.375-1.425.525-3 .788-5.887-.187-5.887-.187s1.987-2.288 4.987-3.075c2.212-.563 4.35-.188 5.325.037"
            />
          </g>

          {/* Prismatic Holographic Sheen Overlay */}
          <g
            style={{ mixBlendMode: "overlay" }}
            mask={`url(#badgeMask_${uniqueId})`}
            className="pointer-events-none"
          >
            {overlayHues.map((fillColor, i) => (
              <g
                key={i}
                style={{
                  transform: reducedMotion
                    ? "none"
                    : `rotate(${overlayPosition + i * 10}deg)`,
                  transformOrigin: "130px 27px",
                  transition: reducedMotion
                    ? "none"
                    : isHovered
                    ? "transform 90ms cubic-bezier(0.2, 0, 0, 1)"
                    : "transform 450ms cubic-bezier(0.16, 1, 0.3, 1)",
                  animation:
                    reducedMotion || isHovered
                      ? "none"
                      : `overlayAnimation_${uniqueId}_${i + 1} 6s ease-in-out infinite`,
                  willChange: "transform",
                }}
              >
                <polygon
                  points="0,0 260,54 260,0 0,54"
                  fill={fillColor}
                  filter={`url(#blur1_${uniqueId})`}
                  opacity="0.45"
                />
              </g>
            ))}
          </g>
        </svg>
      </div>
    </a>
  );
};

export default AwardBadge;

const demoLink = "https://www.producthunt.com/golden-kitty-awards/hall-of-fame?year=2024#bootstrapped-small-teams-2";

export const GoldenKitty = ({ link = demoLink }: { link?: string }) => (
  <div className="grid grid-cols-1 gap-4">
    <AwardBadge type="golden-kitty" link={link} />
  </div>
);

export const ProductOfTheDay = ({ place = 1, link = demoLink }: { place?: number; link?: string }) => (
  <div className="grid grid-cols-1 gap-4">
    <AwardBadge type="product-of-the-day" place={place} link={link} />
  </div>
);

export const ProductOfTheMonth = ({ place = 2, link = demoLink }: { place?: number; link?: string }) => (
  <div className="grid grid-cols-1 gap-4">
    <AwardBadge type="product-of-the-month" place={place} link={link} />
  </div>
);

export const ProductOfTheWeek = ({ place = 3, link = demoLink }: { place?: number; link?: string }) => (
  <div className="grid grid-cols-1 gap-4">
    <AwardBadge type="product-of-the-week" place={place} link={link} />
  </div>
);
