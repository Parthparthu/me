import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius-sm,8px)] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring,#22D3EE)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 touch-action-manipulation",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--accent,#22D3EE)] text-[var(--text-inverse,#060B18)] hover:bg-[var(--accent-hover,#67E8F9)] font-semibold shadow-sm",
        destructive:
          "bg-[var(--destructive,#ef4444)] text-white hover:bg-red-600/90 shadow-sm",
        outline:
          "border border-[var(--separator-strong,rgba(255,255,255,0.14))] bg-transparent text-[var(--label-primary,#F2F5FA)] hover:bg-[var(--bg-hover,rgba(255,255,255,0.05))]",
        secondary:
          "bg-[var(--bg-elevated,#152033)] text-[var(--label-primary,#F2F5FA)] hover:bg-[var(--bg-hover,rgba(255,255,255,0.08))] border border-[var(--separator,rgba(255,255,255,0.08))]",
        ghost:
          "text-[var(--label-secondary,#A9B4C7)] hover:text-[var(--label-primary,#F2F5FA)] hover:bg-[var(--bg-hover,rgba(255,255,255,0.05))]",
        link:
          "text-[var(--accent,#22D3EE)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-[var(--radius-xs,4px)] px-3 text-xs",
        lg: "h-11 rounded-[var(--radius-md,12px)] px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
