/**
 * Glass component variants — Pre-configured wrappers around LiquidGlass
 * for each design system use case. Import these instead of using LiquidGlass directly.
 */
'use client';

import React, { type ButtonHTMLAttributes, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { LiquidGlass, type LiquidGlassProps } from './LiquidGlass';
import { cn } from '@/lib/utils';

// ─── GlassCard ────────────────────────────────────────────────────────────────
/** Elevation-3 card for project cards, skill cards, achievement cards */
export function GlassCard({
  className,
  children,
  ...props
}: LiquidGlassProps) {
  return (
    <LiquidGlass
      elevation={3}
      refraction={0.4}
      tint="neutral"
      radius={24}
      dynamicLight
      variant="card"
      className={cn('p-0', className)}
      {...props}
    >
      {children}
    </LiquidGlass>
  );
}

// ─── GlassPanel ───────────────────────────────────────────────────────────────
/** Elevation-4 large panel for section backgrounds and overlays */
export function GlassPanel({
  className,
  children,
  ...props
}: LiquidGlassProps) {
  return (
    <LiquidGlass
      elevation={4}
      refraction={0.6}
      tint="neutral"
      radius={32}
      dynamicLight
      variant="panel"
      className={className}
      {...props}
    >
      {children}
    </LiquidGlass>
  );
}

// ─── GlassPill ────────────────────────────────────────────────────────────────
/** Elevation-2 pill for nav items, badges, status indicators */
export function GlassPill({
  className,
  children,
  ...props
}: LiquidGlassProps) {
  return (
    <LiquidGlass
      elevation={2}
      refraction={0.2}
      tint="neutral"
      radius={999}
      dynamicLight
      variant="pill"
      className={cn('px-4 py-2 inline-flex items-center gap-2', className)}
      {...props}
    >
      {children}
    </LiquidGlass>
  );
}

// ─── GlassModal ───────────────────────────────────────────────────────────────
/** Elevation-5 modal container for overlays, command palette, dialogs */
export function GlassModal({
  className,
  children,
  ...props
}: LiquidGlassProps) {
  return (
    <LiquidGlass
      elevation={5}
      refraction={0.7}
      tint="neutral"
      radius={28}
      dynamicLight
      variant="modal"
      className={cn('w-full', className)}
      {...props}
    >
      {children}
    </LiquidGlass>
  );
}

// ─── GlassButton ─────────────────────────────────────────────────────────────
/** Interactive glass button with press depth and magnetic hover */
interface GlassButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    Pick<LiquidGlassProps, 'elevation' | 'tint'> {
  variant?: 'primary' | 'secondary' | 'ghost';
}

export function GlassButton({
  className,
  children,
  elevation = 2,
  tint = 'neutral',
  variant = 'secondary',
  ...props
}: GlassButtonProps) {
  return (
    <LiquidGlass
      as="button"
      elevation={elevation}
      tint={variant === 'primary' ? 'violet' : tint}
      radius={14}
      dynamicLight
      variant="button"
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold text-sm',
        'min-h-[44px] px-6 py-3 cursor-pointer whitespace-nowrap',
        'transition-transform duration-150 active:scale-[0.97]',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
        'focus-visible:outline-[var(--border-focus)]',
        variant === 'primary' && 'text-white',
        variant === 'secondary' && 'text-[var(--text-primary)]',
        variant === 'ghost' && 'text-[var(--text-secondary)]',
        className
      )}
      {...(props as unknown as React.HTMLAttributes<HTMLDivElement>)}
    >
      {children}
    </LiquidGlass>
  );
}

// ─── GlassInput ───────────────────────────────────────────────────────────────
/** Glass-styled form input with refractive focus state */
interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  inputClassName?: string;
}

export function GlassInput({
  label,
  error,
  className,
  inputClassName,
  id,
  ...props
}: GlassInputProps) {
  const generatedId = React.useId();
  const inputId = id || generatedId;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-[var(--text-secondary)]"
        >
          {label}
          {props.required && (
            <span className="ml-1 text-[var(--accent-primary)]" aria-label="required">*</span>
          )}
        </label>
      )}
      <LiquidGlass
        elevation={1}
        tint="neutral"
        radius={12}
        dynamicLight={false}
        className="focus-within:ring-2 focus-within:ring-[var(--border-focus)] transition-shadow duration-200"
      >
        <input
          id={inputId}
          className={cn(
            'w-full bg-transparent px-4 py-3 text-[var(--text-primary)]',
            'text-base placeholder:text-[var(--text-muted)]',
            'focus:outline-none',
            'min-h-[44px]',
            inputClassName
          )}
          {...props}
        />
      </LiquidGlass>
      {error && (
        <p className="text-sm text-[var(--accent-rose)] flex items-center gap-1.5" role="alert">
          <span aria-hidden="true">⚠</span>
          {error}
        </p>
      )}
    </div>
  );
}

// ─── GlassTextarea ────────────────────────────────────────────────────────────
interface GlassTextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  textareaClassName?: string;
}

export function GlassTextarea({
  label,
  error,
  className,
  textareaClassName,
  id,
  ...props
}: GlassTextareaProps) {
  const generatedId = React.useId();
  const inputId = id || generatedId;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-[var(--text-secondary)]"
        >
          {label}
          {props.required && (
            <span className="ml-1 text-[var(--accent-primary)]" aria-label="required">*</span>
          )}
        </label>
      )}
      <LiquidGlass
        elevation={1}
        tint="neutral"
        radius={12}
        dynamicLight={false}
        className="focus-within:ring-2 focus-within:ring-[var(--border-focus)] transition-shadow duration-200"
      >
        <textarea
          id={inputId}
          className={cn(
            'w-full bg-transparent px-4 py-3 text-[var(--text-primary)]',
            'text-base placeholder:text-[var(--text-muted)]',
            'focus:outline-none resize-none',
            textareaClassName
          )}
          {...props}
        />
      </LiquidGlass>
      {error && (
        <p className="text-sm text-[var(--accent-rose)] flex items-center gap-1.5" role="alert">
          <span aria-hidden="true">⚠</span>
          {error}
        </p>
      )}
    </div>
  );
}
