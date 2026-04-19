import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { CheckCircle2, XCircle, Clock, Search, Filter, MoreHorizontal, User, Calendar, MessageSquare } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useAuthStore } from '../store/useAuthStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { apiRequest, getAuthHeaders } from '../services/api';
export const ApprovalsPage = () => {
    const { bookings, resources, fetchBookings, fetchNotifications, fetchAdminData } = useAppStore();
    const { token, user } = useAuthStore();
    const [filter, setFilter] = useState('PENDING');
    const [searchTerm, setSearchTerm] = useState('');
    const [processingId, setProcessingId] = useState(null);
    const filteredBookings = bookings.filter(b => {
        const matchesStatus = filter === 'ALL' ? true : b.status === filter;
        const matchesSearch = (b.purpose || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.id.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });
    const handleAction = async (id, action) => {
        if (!token)
            return;
        const reason = window.prompt(`Please provide a reason for ${action === 'approve' ? 'approval' : 'rejection'}:`, action === 'approve' ? 'Meets facility usage policy' : 'Resource unavailable for this time');
        if (reason === null)
            return;
        setProcessingId(id);
        try {
            await apiRequest(`/bookings/${id}/${action}`, {
                method: 'PATCH',
                headers: getAuthHeaders(token),
                body: JSON.stringify({ reason })
            });
            await Promise.all([
                fetchBookings(token),
                fetchNotifications(token),
                fetchAdminData(token, user?.role === 'ADMIN')
            ]);
        }
        catch (error) {
            alert(`Failed to ${action}: ${error.message}`);
        }
        finally {
            setProcessingId(null);
        }
    };
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold tracking-tight", children: "Approval Workflow" }), _jsx("p", { className: "text-muted-foreground mt-1", children: "Review and manage resource allocation requests." })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }), _jsx(Input, { className: "pl-9 w-64", placeholder: "Search by purpose or ID...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value) })] }), _jsxs(Button, { variant: "outline", className: "gap-2", children: [_jsx(Filter, { className: "w-4 h-4" }), " Filters"] })] })] }), _jsx("div", { className: "flex gap-2 p-1 bg-accent/30 rounded-xl w-fit", children: ['PENDING', 'APPROVED', 'REJECTED', 'ALL'].map((tab) => (_jsxs("button", { onClick: () => setFilter(tab), className: `px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === tab
                        ? 'bg-card text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'}`, children: [tab.charAt(0) + tab.slice(1).toLowerCase(), tab !== 'ALL' && (_jsxs("span", { className: "ml-2 opacity-60", children: ["(", bookings.filter(b => b.status === tab).length, ")"] }))] }, tab))) }), _jsxs("div", { className: "grid grid-cols-1 gap-4", children: [filteredBookings.map((booking) => {
                        const resource = resources.find(r => r.id === booking.resourceId);
                        return (_jsx(Card, { className: "group overflow-hidden border-border/50 hover:border-primary/30 transition-all", children: _jsxs("div", { className: "flex flex-col lg:flex-row items-stretch", children: [_jsx("div", { className: `w-1 lg:w-1.5 shrink-0 ${booking.status === 'APPROVED' ? 'bg-emerald-500' :
                                            booking.status === 'REJECTED' ? 'bg-destructive' :
                                                'bg-amber-500'}` }), _jsx("div", { className: "flex-1 p-6", children: _jsxs("div", { className: "flex flex-col lg:flex-row lg:items-center justify-between gap-8", children: [_jsxs("div", { className: "flex items-start gap-4", children: [_jsx("div", { className: "w-12 h-12 rounded-xl bg-accent flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-all", children: _jsx(Calendar, { className: "w-6 h-6 text-muted-foreground group-hover:text-primary" }) }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("h3", { className: "font-bold text-lg", children: booking.purpose || 'Campus Resource Request' }), _jsx(Badge, { variant: "outline", className: "text-[10px] uppercase", children: booking.id.slice(-6) })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 text-sm text-muted-foreground", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Clock, { className: "w-4 h-4 text-primary/60" }), " ", new Date(booking.startTime).toLocaleString()] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(User, { className: "w-4 h-4 text-primary/60" }), " ID: ", booking.requesterId.slice(-8).toUpperCase()] }), _jsxs("div", { className: "flex items-center gap-2 font-medium text-foreground", children: [_jsx(CheckCircle2, { className: "w-4 h-4 text-primary/60" }), " ", resource?.name || 'Loading Resource...'] })] })] })] }), _jsx("div", { className: "flex items-center gap-3 self-end lg:self-center", children: booking.status === 'PENDING' ? (_jsxs(_Fragment, { children: [_jsxs(Button, { variant: "outline", className: "text-destructive hover:bg-destructive/10 border-destructive/20 h-10 px-6 gap-2", onClick: () => handleAction(booking.id, 'reject'), isLoading: processingId === booking.id, children: [_jsx(XCircle, { className: "w-4 h-4" }), " Reject"] }), _jsxs(Button, { className: "bg-emerald-600 hover:bg-emerald-500 text-white h-10 px-6 gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]", onClick: () => handleAction(booking.id, 'approve'), isLoading: processingId === booking.id, children: [_jsx(CheckCircle2, { className: "w-4 h-4" }), " Approve"] })] })) : (_jsxs("div", { className: "flex items-center gap-6", children: [booking.approvalReason && (_jsxs("div", { className: "hidden xl:flex items-center gap-2 text-xs text-muted-foreground bg-accent/30 px-3 py-1.5 rounded-lg border border-border/50 max-w-xs truncate", children: [_jsx(MessageSquare, { className: "w-3.5 h-3.5 shrink-0" }), _jsxs("span", { className: "italic", children: ["\"", booking.approvalReason, "\""] })] })), _jsx(Badge, { variant: booking.status === 'APPROVED' ? 'success' : 'destructive', className: "h-10 px-6 text-sm", children: booking.status }), _jsx(Button, { variant: "ghost", size: "icon", className: "text-muted-foreground", children: _jsx(MoreHorizontal, { className: "w-4 h-4" }) })] })) })] }) })] }) }, booking.id));
                    }), filteredBookings.length === 0 && (_jsxs("div", { className: "py-24 text-center border border-dashed border-border rounded-2xl", children: [_jsx(Clock, { className: "w-12 h-12 text-muted-foreground/30 mx-auto mb-4" }), _jsx("h3", { className: "text-xl font-semibold mb-1", children: "Queue Empty" }), _jsx("p", { className: "text-muted-foreground", children: "No bookings found matching the current filter." })] }))] })] }));
};
