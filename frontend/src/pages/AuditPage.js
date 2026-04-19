import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FileSearch, Download, Search, Calendar, User, Activity, Shield } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useAuthStore } from '../store/useAuthStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { apiRequest, getAuthHeaders } from '../services/api';
export const AuditPage = () => {
    const { auditLogs, loadingStates } = useAppStore();
    const { token } = useAuthStore();
    const exportCsv = async () => {
        if (!token)
            return;
        try {
            const csv = await apiRequest('/audit?export=csv', {
                headers: {
                    ...getAuthHeaders(token),
                    Accept: 'text/csv'
                }
            });
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `campussync-audit-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        }
        catch (error) {
            alert('Export failed: ' + error.message);
        }
    };
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-6", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-3xl font-bold tracking-tight flex items-center gap-3", children: [_jsx(Shield, { className: "text-primary w-8 h-8" }), "Audit Governance"] }), _jsx("p", { className: "text-muted-foreground mt-1", children: "Immutable record of all system activities and administrative actions." })] }), _jsxs(Button, { variant: "outline", className: "gap-2 h-11", onClick: exportCsv, children: [_jsx(Download, { className: "w-4 h-4" }), " Export CSV"] })] }), _jsxs(Card, { className: "border-border/50", children: [_jsx(CardHeader, { className: "border-b border-border/50 bg-accent/5", children: _jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Activity, { className: "w-4 h-4 text-primary" }), _jsx(CardTitle, { className: "text-lg", children: "Activity Stream" })] }), _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }), _jsx(Input, { className: "pl-9 w-72 h-9 bg-background", placeholder: "Filter logs by action or user..." })] })] }) }), _jsxs(CardContent, { className: "p-0", children: [_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm text-left", children: [_jsx("thead", { className: "text-xs text-muted-foreground uppercase bg-accent/10 border-b border-border/50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-4 font-semibold", children: "Action" }), _jsx("th", { className: "px-6 py-4 font-semibold", children: "Entity Type" }), _jsx("th", { className: "px-6 py-4 font-semibold", children: "Entity ID" }), _jsx("th", { className: "px-6 py-4 font-semibold", children: "Actor" }), _jsx("th", { className: "px-6 py-4 font-semibold text-right", children: "Timestamp" })] }) }), _jsx("tbody", { className: "divide-y divide-border/50", children: auditLogs.map((log) => (_jsxs("tr", { className: "hover:bg-accent/20 transition-colors group", children: [_jsx("td", { className: "px-6 py-4 font-medium", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-2 h-2 rounded-full bg-primary" }), log.action] }) }), _jsx("td", { className: "px-6 py-4", children: _jsx(Badge, { variant: "outline", className: "bg-accent/30", children: log.entityType }) }), _jsx("td", { className: "px-6 py-4 font-mono text-[10px] text-muted-foreground", children: log.entityId }), _jsx("td", { className: "px-6 py-4", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(User, { className: "w-3.5 h-3.5 opacity-40" }), _jsx("span", { className: "text-xs", children: log.actorId.slice(-8).toUpperCase() })] }) }), _jsx("td", { className: "px-6 py-4 text-right text-muted-foreground", children: _jsxs("div", { className: "flex flex-col items-end", children: [_jsxs("span", { className: "flex items-center gap-1.5", children: [_jsx(Calendar, { className: "w-3 h-3" }), " ", new Date(log.createdAt).toLocaleDateString()] }), _jsx("span", { className: "text-[10px]", children: new Date(log.createdAt).toLocaleTimeString() })] }) })] }, log.id))) })] }) }), loadingStates.audit === 'loading' && (_jsx("div", { className: "p-12 text-center text-muted-foreground animate-pulse", children: "Syncing audit logs from blockchain..." })), auditLogs.length === 0 && loadingStates.audit !== 'loading' && (_jsxs("div", { className: "py-24 text-center", children: [_jsx(FileSearch, { className: "w-12 h-12 text-muted-foreground/20 mx-auto mb-4" }), _jsx("h3", { className: "text-xl font-bold", children: "No Audit Records" }), _jsx("p", { className: "text-muted-foreground", children: "Wait for system activity to populate this list." })] }))] })] })] }));
};
