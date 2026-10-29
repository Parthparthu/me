"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Navigation, Award, Sliders, Clock, Compass, Layers } from "lucide-react";
import SculptureHero from "@/components/ui/liquid-sculpture-hero";
import Timeline from "@/components/ui/timeline";
import { ShinyButton } from "@/components/ui/shiny-button";
import { AnimatedNavFramer } from "@/components/ui/navigation-menu";
import {
  AwardBadge,
  GoldenKitty,
  ProductOfTheDay,
  ProductOfTheMonth,
  ProductOfTheWeek,
} from "@/components/ui/award-badge";
import { Tabs } from "@/components/ui/vercel-tabs";
import { Button } from "@/components/ui/button";

const DEMO_TABS = [
  { id: "sculpture", label: "Liquid Sculpture Hero" },
  { id: "timeline", label: "GSAP Horizontal Timeline" },
  { id: "shiny-button", label: "Shiny CTA Button" },
  { id: "navigation", label: "Animated Floating Nav" },
  { id: "award-badge", label: "3D Award Badge" },
  { id: "vercel-tabs", label: "Vercel Filter Tabs" },
];

export default function DemosPage() {
  const [activeDemo, setActiveDemo] = useState("sculpture");
  const [clickCount, setClickCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <div className="min-h-screen bg-[var(--bg-primary,#060B18)] text-[var(--label-primary,#F2F5FA)] flex flex-col">
      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-40 border-b border-[var(--separator,rgba(255,255,255,0.08))] bg-[var(--bg-primary,#060B18)]/90 backdrop-blur-md px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[var(--label-secondary,#A9B4C7)] hover:text-[var(--label-primary,#F2F5FA)] transition-colors p-1.5 rounded-[var(--radius-xs,4px)] hover:bg-[var(--bg-hover,rgba(255,255,255,0.05))]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Portfolio</span>
            </Link>
            <div className="h-4 w-px bg-[var(--separator,rgba(255,255,255,0.1))]" />
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--accent,#22D3EE)]">
              UI Component Showcase
            </span>
          </div>

          {/* Tab Selector */}
          <div className="w-full sm:w-auto overflow-x-auto">
            <Tabs
              tabs={DEMO_TABS}
              activeTab={activeDemo}
              onTabChange={(tabId) => setActiveDemo(tabId)}
            />
          </div>
        </div>
      </header>

      {/* Main Preview Area */}
      <main className="flex-1 w-full">
        {activeDemo === "sculpture" && (
          <div className="relative w-full min-h-[90vh]">
            <div className="absolute top-4 left-6 z-30 pointer-events-none bg-[var(--bg-elevated,#0E1626)]/80 backdrop-blur-sm border border-[var(--separator,rgba(255,255,255,0.1))] rounded-lg px-4 py-2">
              <p className="text-xs text-[var(--label-secondary,#A9B4C7)]">
                💡 Move your cursor or touch over the liquid sculpture to deform the particles
              </p>
            </div>
            <SculptureHero
              eyebrow="Interactive WebGL2 Particle Simulation"
              headline={"Particles in\nmotion."}
              headlineAccent="in motion."
              body="GPU-accelerated GPGPU simulation with ~100k particles sampled from original imagery. The cursor liquefies the material into wake currents before it elastically settles."
              primaryCta={{ label: "View Portfolio Projects", href: "/#selected-work" }}
              secondaryCta={{ label: "Back to Home", href: "/" }}
              height="calc(100svh - 60px)"
            />
          </div>
        )}

        {activeDemo === "timeline" && (
          <div className="w-full">
            <section className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-6 text-center pt-16">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--accent,#22D3EE)]">
                Interactive Engineering Storyline
              </span>
              <h1 className="max-w-[20ch] text-3xl sm:text-5xl font-bold tracking-tight">
                Scroll Down to Pin & Slide Horizontally
              </h1>
              <p className="max-w-lg text-sm text-[var(--label-secondary,#A9B4C7)]">
                The GSAP ScrollTrigger timeline pins to the viewport, draws animated connection stems, and slides through authentic engineering milestones.
              </p>
              <div className="mt-4 animate-bounce text-[var(--accent,#22D3EE)] text-xl">&darr;</div>
            </section>

            <Timeline />

            <section className="flex h-[40vh] items-center justify-center px-6 text-center text-sm text-[var(--label-secondary,#A9B4C7)]">
              Timeline completed. Continue scrolling down or switch tabs above.
            </section>
          </div>
        )}

        {activeDemo === "shiny-button" && (
          <div className="min-h-[70vh] flex flex-col items-center justify-center gap-8 px-4 py-16 text-center">
            <div className="max-w-xl space-y-3">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--accent,#22D3EE)]">
                CSS Paint & Radial Gradient Button
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Breathing Shimmer CTA
              </h2>
              <p className="text-sm text-[var(--label-secondary,#A9B4C7)]">
                Features conic gradient border animation, subtle ambient dot-mask pattern, and smooth spring hover states tailored to the cyan brand token.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <ShinyButton
                onClick={() => setClickCount((c) => c + 1)}
                className="text-base"
              >
                <Sparkles className="w-4 h-4" />
                <span>Explore Interactive Showcase</span>
              </ShinyButton>

              <Button
                variant="outline"
                onClick={() => setClickCount(0)}
                className="text-xs"
              >
                Reset Clicks ({clickCount})
              </Button>
            </div>

            {clickCount > 0 && (
              <p className="text-xs font-mono text-[var(--accent,#22D3EE)] animate-pulse">
                Clicked {clickCount} {clickCount === 1 ? "time" : "times"}! Full keyboard and touch accessibility enabled.
              </p>
            )}
          </div>
        )}

        {activeDemo === "navigation" && (
          <div className="min-h-[140vh] w-full relative">
            <AnimatedNavFramer />

            <div className="max-w-3xl mx-auto pt-32 px-6 text-center space-y-6">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--accent,#22D3EE)]">
                Framer Motion Collapsible Navigation
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Floating Capsule Navbar
              </h2>
              <p className="text-sm text-[var(--label-secondary,#A9B4C7)]">
                Scroll down to see the capsule gracefully collapse into a compact circular menu icon. Scroll back up or click the collapsed pill to instantly expand it.
              </p>
            </div>

            <div className="max-w-4xl mx-auto my-20 p-8 rounded-[var(--radius-lg,20px)] border border-[var(--separator,rgba(255,255,255,0.08))] bg-[var(--bg-secondary,#0E1626)] space-y-6">
              <h3 className="text-xl font-semibold">Simulated Page Content</h3>
              <p className="text-sm text-[var(--label-secondary,#A9B4C7)] leading-relaxed">
                Notice how the navigation bar at the top responds smoothly to scroll gestures with built-in hysteresis thresholds, ensuring it never flickers while reading or scrolling.
              </p>
              <div className="h-64 rounded-lg bg-[var(--bg-grouped,#090F1E)] flex items-center justify-center text-xs text-[var(--label-tertiary,#8090AB)]">
                Scroll down further to test collapse behavior ↓
              </div>
            </div>
          </div>
        )}

        {activeDemo === "award-badge" && (
          <div className="min-h-[70vh] flex flex-col items-center justify-center gap-10 px-4 py-16">
            <div className="max-w-xl text-center space-y-3">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--accent,#22D3EE)]">
                Interactive 3D Mouse Parallax
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                3D Award Badges
              </h2>
              <p className="text-sm text-[var(--label-secondary,#A9B4C7)]">
                Move your cursor over each badge to see the dynamic perspective tilt and animated optical gradient overlays.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-items-center">
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs font-mono text-[var(--label-tertiary,#8090AB)]">
                  World Memory Championship (Authentic)
                </span>
                <AwardBadge
                  type="wmc-medal"
                  place={3}
                  customTitle="World Memory Champ"
                  customOrganization="IAM CHAMPIONSHIP"
                  link="/#achievements"
                />
              </div>

              <div className="flex flex-col items-center gap-2">
                <span className="text-xs font-mono text-[var(--label-tertiary,#8090AB)]">
                  Product of the Day #1
                </span>
                <ProductOfTheDay />
              </div>

              <div className="flex flex-col items-center gap-2">
                <span className="text-xs font-mono text-[var(--label-tertiary,#8090AB)]">
                  Product of the Month #2
                </span>
                <ProductOfTheMonth />
              </div>

              <div className="flex flex-col items-center gap-2">
                <span className="text-xs font-mono text-[var(--label-tertiary,#8090AB)]">
                  Product of the Week #3
                </span>
                <ProductOfTheWeek />
              </div>
            </div>
          </div>
        )}

        {activeDemo === "vercel-tabs" && (
          <div className="min-h-[70vh] flex flex-col items-center justify-center gap-8 px-4 py-16">
            <div className="max-w-xl text-center space-y-3">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--accent,#22D3EE)]">
                Keyboard-Accessible Sliding Tabs
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Vercel Sliding Indicator
              </h2>
              <p className="text-sm text-[var(--label-secondary,#A9B4C7)]">
                Features floating hover background pill, sliding active indicator, count badges, and full WAI-ARIA keyboard navigation (arrow keys, Home, End).
              </p>
            </div>

            <div className="p-6 rounded-[var(--radius-lg,20px)] border border-[var(--separator,rgba(255,255,255,0.08))] bg-[var(--bg-secondary,#0E1626)] w-full max-w-2xl flex flex-col items-center gap-6">
              <Tabs
                activeTab={selectedCategory}
                onTabChange={(tabId) => setSelectedCategory(tabId)}
              />

              <div className="w-full p-8 rounded-lg bg-[var(--bg-grouped,#090F1E)] border border-[var(--separator,rgba(255,255,255,0.05))] text-center">
                <span className="text-xs font-mono uppercase text-[var(--accent,#22D3EE)]">
                  Active Filter
                </span>
                <p className="text-xl font-bold mt-1 text-[var(--label-primary,#F2F5FA)] capitalize">
                  {selectedCategory.replace(/-/g, " ")}
                </p>
                <p className="text-xs text-[var(--label-secondary,#A9B4C7)] mt-2">
                  Use the Left / Right arrow keys to navigate with keyboard focus.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
