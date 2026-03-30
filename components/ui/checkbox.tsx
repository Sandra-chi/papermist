import * as React from 'react';

import { cn } from '@/lib/utils';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      type="checkbox"
      className={cn('h-5 w-5 rounded border-border text-primary focus:ring-ring', className)}
      {...props}
    />
  );
});
Checkbox.displayName = 'Checkbox';

export { Checkbox };
