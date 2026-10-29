"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Compass, Menu, House, Folder, User, BookOpen, Mail, FileText, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavItemConfig {
  name: string;
  href: string;
  icon?: LucideIcon;
}

const DEFAULT_PORTFOLIO_NAV_ITEMS: NavItemConfig[] = [
  { name: "Home", href: "/#hero", icon: House },
  { name: "Work", href: "/#selected-work", icon: Folder },
  { name: "About", href: "/#about", icon: User },
  { name: "Journey", href: "/#journey", icon: BookOpen },
  { name: "Resume", href: "/resume", icon: FileText },
  { name: "Contact", href: "/#contact", icon: Mail },
];

const EXPAND_SCROLL_THRESHOLD = 80;

const containerVariants = {
  expanded: {
    y: 0,
    opacity: 1,
    width: "auto",
    transition: {
      y: { type: "spring", damping: 18, stiffness: 250 },
      opacity: { duration: 0.3 },
      type: "spring",
      damping: 20,
      stiffness: 300,
      staggerChildren: 0.07,
      delayChildren: 0.2,
    },
  },
  collapsed: {
    y: 0,
    opacity: 1,
    width: "3.25rem",
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 300,
      when: "afterChildren",
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const logoVariants = {
  expanded: { opacity: 1, x: 0, rotate: 0, transition: { type: "spring", damping: 15 } },
  collapsed: { opacity: 0, x: -25, rotate: -180, transition: { duration: 0.3 } },
};

const itemVariants = {
  expanded: { opacity: 1, x: 0, scale: 1, transition: { type: "spring", damping: 15 } },
  collapsed: { opacity: 0, x: -20, scale: 0.95, transition: { duration: 0.2 } },
};

const collapsedIconVariants = {
  expanded: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  collapsed: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 300,
      delay: 0.15,
    },
  },
};

export interface AnimatedNavFramerProps {
  items?: NavItemConfig[];
  className?: string;
}

export function AnimatedNavFramer({
  items = DEFAULT_PORTFOLIO_NAV_ITEMS,
  className,
}: AnimatedNavFramerProps) {
  const [isExpanded, setExpanded] = React.useState(true);

  const { scrollY } = useScroll();
  const lastScrollY = React.useRef(0);
  const scrollPositionOnCollapse = React.useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = lastScrollY.current;

    if (isExpanded && latest > previous && latest > 150) {
      setExpanded(false);
      scrollPositionOnCollapse.current = latest;
    } else if (
      !isExpanded &&
      latest < previous &&
      scrollPositionOnCollapse.current - latest > EXPAND_SCROLL_THRESHOLD
    ) {
      setExpanded(true);
    }

    lastScrollY.current = latest;
  });

  const handleNavClick = (e: React.MouseEvent) => {
    if (!isExpanded) {
      e.preventDefault();
      setExpanded(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isExpanded && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      setExpanded(true);
    }
  };

  return (
    <div
      className={cn(
        "fixed top-6 left-1/2 -translate-x-1/2 z-[200] max-w-[95vw]",
        className
      )}
    >
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={isExpanded ? "expanded" : "collapsed"}
        variants={containerVariants}
        whileHover={!isExpanded ? { scale: 1.08 } : {}}
        whileTap={!isExpanded ? { scale: 0.95 } : {}}
        onClick={handleNavClick}
        onKeyDown={handleKeyDown}
        tabIndex={!isExpanded ? 0 : undefined}
        role="navigation"
        aria-label="Floating Navigation Menu"
        className={cn(
          "flex items-center overflow-hidden rounded-full border border-[var(--separator,rgba(255,255,255,0.12))] bg-[var(--bg-elevated,#0E1626)]/85 shadow-xl shadow-black/40 backdrop-blur-md h-12 transition-all duration-300",
          !isExpanded && "cursor-pointer justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring,#22D3EE)]"
        )}
      >
        <motion.div
          variants={logoVariants}
          className="flex-shrink-0 flex items-center font-semibold pl-4 pr-2 text-[var(--accent,#22D3EE)]"
        >
          <Compass className="h-5 w-5" />
        </motion.div>

        <motion.div
          className={cn(
            "flex items-center gap-1 sm:gap-2 pr-3",
            !isExpanded && "pointer-events-none"
          )}
        >
          {items.map((item) => (
            <motion.div key={item.name} variants={itemVariants}>
              <Link
                href={item.href}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[var(--label-secondary,#A9B4C7)] hover:text-[var(--label-primary,#F2F5FA)] hover:bg-[var(--bg-hover,rgba(255,255,255,0.05))] transition-colors px-3 py-1.5 rounded-full touch-action-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring,#22D3EE)]"
              >
                {item.icon && <item.icon className="h-3.5 w-3.5 opacity-70" />}
                <span>{item.name}</span>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-[var(--accent,#22D3EE)]">
          <motion.div
            variants={collapsedIconVariants}
            animate={isExpanded ? "expanded" : "collapsed"}
          >
            <Menu className="h-5 w-5" />
          </motion.div>
        </div>
      </motion.nav>
    </div>
  );
}

export default AnimatedNavFramer;
