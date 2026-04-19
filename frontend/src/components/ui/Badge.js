import { jsx as _jsx } from "react/jsx-runtime";
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
function cn(...inputs) {
    return twMerge(clsx(inputs));
}
export const Badge = ({ className, variant = 'default', ...props }) => {
    const variants = {
        default: 'bg-primary text-primary-foreground hover:bg-primary/80',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground border border-input hover:bg-accent hover:text-accent-foreground',
        success: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
        warning: 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
    };
    return (_jsx("div", { className: cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2', variants[variant], className), ...props }));
};
