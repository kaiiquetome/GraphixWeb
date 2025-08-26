import React from 'react'
import { clsx } from 'clsx'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={clsx(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          {
            'bg-primary text-primary-foreground hover:bg-primary/80': variant === 'default',
            'bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'secondary',
            'bg-destructive text-destructive-foreground hover:bg-destructive/80': variant === 'destructive',
            'text-foreground border border-input bg-background hover:bg-accent hover:text-accent-foreground': variant === 'outline',
          },
          className
        )}
        {...props}
      />
    )
  }
)
Badge.displayName = 'Badge' 