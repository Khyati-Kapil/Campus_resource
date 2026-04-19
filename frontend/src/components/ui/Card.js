import { jsx as _jsx } from "react/jsx-runtime";
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
function cn(...inputs) {
    return twMerge(clsx(inputs));
}
export const Card = ({ className, children }) => (_jsx("div", { className: cn('glass-card p-6', className), children: children }));
export const CardHeader = ({ className, children }) => (_jsx("div", { className: cn('flex flex-col space-y-1.5 mb-4', className), children: children }));
export const CardTitle = ({ className, children }) => (_jsx("h3", { className: cn('text-2xl font-semibold leading-none tracking-tight', className), children: children }));
export const CardDescription = ({ className, children }) => (_jsx("p", { className: cn('text-sm text-muted-foreground', className), children: children }));
export const CardContent = ({ className, children }) => (_jsx("div", { className: cn('', className), children: children }));
export const CardFooter = ({ className, children }) => (_jsx("div", { className: cn('flex items-center pt-4', className), children: children }));
