import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50',
        size === 'default' && 'px-4 py-2 text-sm',
        size === 'sm' && 'p-2 text-sm',
        variant === 'default' && 'bg-accent text-accent-foreground hover:opacity-90',
        variant === 'outline' && 'border border-muted bg-transparent hover:bg-muted',
        variant === 'ghost' && 'hover:bg-muted',
        className
      )}
      {...props}
    />
  )
);
Button.displayName = 'Button';
export { Button };
