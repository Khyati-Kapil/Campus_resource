import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
function cn(...inputs) {
    return twMerge(clsx(inputs));
}
export const Input = React.forwardRef(({ className, type, ...props }, ref) => {
    return (_jsx("input", { type: type, className: cn('flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all', className), ref: ref, ...props }));
});
Input.displayName = 'Input';
export const Label = ({ className, children, ...props }) => (_jsx("label", { className: cn('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block', className), ...props, children: children }));
