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
import { ALLOW_CAPSULE } from '@/lib/config';
import { cn } from '@/lib/utils';

// GlassCard: 16px-20px squircle radius for project cards, skill cards, achievement cards
export function GlassCard({
  className,
  children,
  radius = 16,
  elevation = 3,
  dynamicLight = true,
  ...props
}: LiquidGlassProps) {
  return (
    <LiquidGlass
      elevation={elevation}
      refraction={0.4}
      tint="neutral"
      radius={radius}
      dynamicLight={dynamicLight}
      variant="card"
      className={cn('p-0', className)}
      {...props}
    >
      {children}
    </LiquidGlass>
  );
}

// GlassPanel: 20px radius for larger panels and overlays
export function GlassPanel({
  className,
  children,
  radius = 20,
  elevation = 4,
  dynamicLight = true,
  ...props
}: LiquidGlassProps) {
  return (
    <LiquidGlass
      elevation={elevation}
      refraction={0.5}
      tint="neutral"
      radius={radius}
      dynamicLight={dynamicLight}
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

// GlassModal: 20px-28px radius container for overlays and dialogs
export function GlassModal({
  className,
  children,
  radius = 20,
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

// GlassButton: 8px-12px radius interactive button with focus outline (never capsule unless ALLOW_CAPSULE)
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
  disabled,
  ...props
}: GlassButtonProps) {
  return (
    <button
      disabled={disabled}
      className={cn(
        'group inline-flex items-center justify-center font-semibold text-sm',
        'min-h-[44px] px-5 py-2.5 cursor-pointer whitespace-nowrap',
        'border',
        ALLOW_CAPSULE ? 'rounded-full' : 'rounded-[var(--radius-sm)] squircle-sm',
        'transition-all duration-[var(--dur-fast)]',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
        'focus-visible:outline-[var(--focus-ring)]',
        'touch-action-manipulation',
        variant === 'primary' && [
          'bg-[var(--accent)] border-[var(--accent)] text-white',
          'hover:bg-[var(--accent-hover)] hover:border-[var(--accent-hover)]',
          'active:scale-[0.98]',
          'shadow-[var(--shadow-sm)]',
        ],
        variant === 'secondary' && [
          'bg-[var(--bg-secondary)] border-[var(--separator-strong)] text-[var(--label-primary)]',
          'hover:bg-[var(--bg-hover)] hover:border-[var(--border-strong,rgba(255,255,255,0.22))]',
          'active:scale-[0.98]',
        ],
        variant === 'ghost' && [
          'bg-transparent border-transparent text-[var(--label-secondary)]',
          'hover:bg-[var(--bg-hover)] hover:text-[var(--label-primary)]',
        ],
        disabled && 'opacity-40 pointer-events-none',
        className
      )}
      {...props}
    >
      <span className="relative z-10 inline-flex items-center justify-center gap-2 leading-none">
        {children}
      </span>
    </button>
  );
}

// GlassInput: 8px-12px radius with min-h-[44px]
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
          className="text-sm font-medium text-[var(--label-secondary)]"
        >
          {label}
          {props.required && (
            <span className="ml-1 text-[var(--accent)]" aria-label="required">*</span>
          )}
        </label>
      )}
      <LiquidGlass
        elevation={1}
        tint="neutral"
        radius={8}
        dynamicLight={false}
        className={cn(
          'transition-all duration-[var(--dur-fast)]',
          error
            ? 'border-[var(--destructive)]'
            : 'border-[var(--separator)] focus-within:border-[var(--focus-ring)] focus-within:ring-2 focus-within:ring-[var(--accent-subtle)]'
        )}
      >
        <input
          id={inputId}
          className={cn(
            'w-full bg-transparent px-4 py-3 text-[var(--label-primary)]',
            'text-base placeholder:text-[var(--label-tertiary)]',
            'focus:outline-none',
            'min-h-[44px]',
            inputClassName
          )}
          {...props}
        />
      </LiquidGlass>
      {error && (
        <p className="text-sm text-[var(--destructive)] flex items-center gap-1.5 mt-1" role="alert">
          <AlertCircle size={14} aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

// GlassTextarea: 8px-12px radius
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
          className="text-sm font-medium text-[var(--label-secondary)]"
        >
          {label}
          {props.required && (
            <span className="ml-1 text-[var(--accent)]" aria-label="required">*</span>
          )}
        </label>
      )}
      <LiquidGlass
        elevation={1}
        tint="neutral"
        radius={8}
        dynamicLight={false}
        className={cn(
          'transition-all duration-[var(--dur-fast)]',
          error
            ? 'border-[var(--destructive)]'
            : 'border-[var(--separator)] focus-within:border-[var(--focus-ring)] focus-within:ring-2 focus-within:ring-[var(--accent-subtle)]'
        )}
      >
        <textarea
          id={inputId}
          className={cn(
            'w-full bg-transparent px-4 py-3 text-[var(--label-primary)]',
            'text-base placeholder:text-[var(--label-tertiary)]',
            'focus:outline-none resize-none',
            textareaClassName
          )}
          {...props}
        />
      </LiquidGlass>
      {error && (
        <p className="text-sm text-[var(--destructive)] flex items-center gap-1.5 mt-1" role="alert">
          <AlertCircle size={14} aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
