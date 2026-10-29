import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-[var(--radius-sm,8px)] border border-[var(--separator-strong,rgba(255,255,255,0.14))] bg-[var(--bg-secondary,#0E1626)] px-3 py-2 text-sm text-[var(--label-primary,#F2F5FA)] placeholder:text-[var(--label-quaternary,#6F7B91)] transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring,#22D3EE)] focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 touch-action-manipulation",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
