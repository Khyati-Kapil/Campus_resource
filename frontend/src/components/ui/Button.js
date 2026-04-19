import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
function cn(...inputs) {
    return twMerge(clsx(inputs));
}
export const Button = React.forwardRef(({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    const variants = {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(59,130,246,0.3)]',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
    };
    const sizes = {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 py-2',
        lg: 'h-12 px-8 text-lg',
        icon: 'h-10 w-10',
    };
    return (_jsxs("button", { ref: ref, className: cn('inline-flex items-center justify-center rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-95', variants[variant], sizes[size], className), disabled: isLoading || props.disabled, ...props, children: [isLoading ? (_jsx("div", { className: "mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" })) : null, children] }));
});
Button.displayName = 'Button';
