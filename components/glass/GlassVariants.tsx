/**
 * Glass component variants: Pre-configured wrappers around LiquidGlass
 * for each design system use case.
 */
'use client';

import React, {
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';
import { AlertCircle } from 'lucide-react';
import { LiquidGlass, type LiquidGlassProps } from './LiquidGlass';
import { cn } from '@/lib/utils';

// GlassCard: 14px radius for project cards, skill cards, achievement cards
export function GlassCard({
  className,
  children,
  radius = 14,
  ...props
}: LiquidGlassProps) {
  return (
    <LiquidGlass
      elevation={3}
      refraction={0.4}
      tint="neutral"
      radius={radius}
      dynamicLight
      variant="card"
      className={cn('p-0', className)}
      {...props}
    >
      {children}
    </LiquidGlass>
  );
}

// GlassPanel: 14px radius for larger panels and overlays
export function GlassPanel({
  className,
  children,
  radius = 14,
  ...props
}: LiquidGlassProps) {
  return (
    <LiquidGlass
      elevation={4}
      refraction={0.5}
      tint="neutral"
      radius={radius}
      dynamicLight
      variant="panel"
      className={className}
      {...props}
    >
      {children}
    </LiquidGlass>
  );
}

// GlassBadge: 8px radius (never pill-shaped)
export function GlassBadge({
  className,
  children,
  radius = 8,
  ...props
}: LiquidGlassProps) {
  return (
    <LiquidGlass
      elevation={2}
      refraction={0.2}
      tint="neutral"
      radius={radius}
      dynamicLight={false}
      variant="badge"
      className={cn('px-3 py-1.5 inline-flex items-center gap-2 text-xs font-medium', className)}
      {...props}
    >
      {children}
    </LiquidGlass>
  );
}

// GlassModal: 14px radius container for overlays and dialogs
export function GlassModal({
  className,
  children,
  radius = 14,
  ...props
}: LiquidGlassProps) {
  return (
    <LiquidGlass
      elevation={5}
      refraction={0.5}
      tint="neutral"
      radius={radius}
      dynamicLight
      variant="modal"
      className={cn('w-full', className)}
      {...props}
    >
      {children}
    </LiquidGlass>
  );
}

// GlassButton: 8px radius interactive button with focus outline
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
      tint={variant === 'primary' ? 'cyan' : tint}
      radius={8}
      dynamicLight
      variant="button"
      className={cn(
        'group inline-flex items-center justify-center font-semibold text-sm',
        'min-h-[44px] px-5 py-2.5 cursor-pointer whitespace-nowrap',
        'transition-colors duration-150',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
        'focus-visible:outline-[var(--border-focus)]',
        variant === 'primary' && 'text-white bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)]',
        variant === 'secondary' && 'text-[var(--text-primary)] hover:text-white',
        variant === 'ghost' && 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
        className
      )}
      {...(props as unknown as React.HTMLAttributes<HTMLDivElement>)}
    >
      <span className="relative z-10 inline-flex items-center justify-center gap-2 leading-none">
        {children}
      </span>
    </LiquidGlass>
  );
}

// GlassInput: 8px radius
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
        radius={8}
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
        <p className="text-sm text-red-400 flex items-center gap-1.5 mt-1" role="alert">
          <AlertCircle size={14} aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

// GlassTextarea: 8px radius
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
        radius={8}
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
        <p className="text-sm text-red-400 flex items-center gap-1.5 mt-1" role="alert">
          <AlertCircle size={14} aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
