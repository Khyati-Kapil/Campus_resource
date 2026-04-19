import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { CalendarDays, Search, Plus, Clock, MapPin, AlertCircle, CheckCircle2, Calendar, ChevronRight, Building2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useAuthStore } from '../store/useAuthStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Label } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { apiRequest, getAuthHeaders } from '../services/api';
export const BookingsPage = () => {
    const { resources, bookings, fetchBookings, fetchNotifications, fetchAdminData } = useAppStore();
    const { token, user } = useAuthStore();
    const [selectedResourceId, setSelectedResourceId] = useState('');
    const [purpose, setPurpose] = useState('');
    const [startTime, setStartTime] = useState(new Date(Date.now() + 3600000).toISOString().slice(0, 16));
    const [endTime, setEndTime] = useState(new Date(Date.now() + 7200000).toISOString().slice(0, 16));
    const [conflictStatus, setConflictStatus] = useState('idle');
    const [conflictMessage, setConflictMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    useEffect(() => {
        if (resources.length > 0 && !selectedResourceId) {
            setSelectedResourceId(resources[0].id);
        }
    }, [resources, selectedResourceId]);
    useEffect(() => {
        if (!token || !selectedResourceId || !startTime || !endTime)
            return;
        const checkConflict = async () => {
            setConflictStatus('checking');
            try {
                const params = new URLSearchParams({
                    resourceId: selectedResourceId,
                    startTime: new Date(startTime).toISOString(),
                    endTime: new Date(endTime).toISOString()
                });
                const data = await apiRequest(`/bookings/conflicts/check?${params.toString()}`, { headers: getAuthHeaders(token) });
                setConflictStatus(data.conflict ? 'conflict' : 'ok');
                setConflictMessage(data.message);
            }
            catch (error) {
                setConflictStatus('error');
                setConflictMessage(error.message);
            }
        };
        const timer = setTimeout(checkConflict, 500);
        return () => clearTimeout(timer);
    }, [selectedResourceId, startTime, endTime, token]);
    const handleCreateBooking = async (e) => {
        e.preventDefault();
        if (conflictStatus === 'conflict' || !token)
            return;
        setIsSubmitting(true);
        setSuccessMessage('');
        try {
            await apiRequest('/bookings', {
                method: 'POST',
                headers: getAuthHeaders(token),
                body: JSON.stringify({
                    resourceId: selectedResourceId,
                    startTime: new Date(startTime).toISOString(),
                    endTime: new Date(endTime).toISOString(),
                    purpose
                })
            });
            setSuccessMessage('Booking request submitted successfully!');
            setPurpose('');
            await Promise.all([
                fetchBookings(token),
                fetchNotifications(token),
                fetchAdminData(token, user?.role === 'ADMIN')
            ]);
        }
        catch (error) {
            setConflictStatus('error');
            setConflictMessage(error.message);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [_jsxs("div", { className: "lg:col-span-1 space-y-8", children: [_jsxs(Card, { className: "border-primary/20 shadow-xl relative overflow-hidden", children: [_jsx("div", { className: "absolute top-0 left-0 w-1 h-full bg-primary" }), _jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Plus, { className: "w-5 h-5 text-primary" }), "New Booking Request"] }), _jsx(CardDescription, { children: "Reserve a campus facility or equipment" })] }), _jsx(CardContent, { children: _jsxs("form", { onSubmit: handleCreateBooking, className: "space-y-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Select Resource" }), _jsx("select", { className: "flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all", value: selectedResourceId, onChange: (e) => setSelectedResourceId(e.target.value), required: true, children: resources.map((r) => (_jsxs("option", { value: r.id, children: [r.name, " (", r.type, ")"] }, r.id))) })] }), _jsxs("div", { className: "grid grid-cols-1 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Start Time" }), _jsx(Input, { type: "datetime-local", value: startTime, onChange: (e) => setStartTime(e.target.value), required: true })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "End Time" }), _jsx(Input, { type: "datetime-local", value: endTime, onChange: (e) => setEndTime(e.target.value), required: true })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Purpose / Description" }), _jsx(Input, { placeholder: "e.g. CS101 Lab Session", value: purpose, onChange: (e) => setPurpose(e.target.value), required: true })] }), conflictStatus !== 'idle' && (_jsxs("div", { className: `p-4 rounded-lg flex items-start gap-3 text-sm transition-all ${conflictStatus === 'checking' ? 'bg-accent/30 text-muted-foreground animate-pulse' :
                                                conflictStatus === 'conflict' ? 'bg-destructive/10 text-destructive border border-destructive/20' :
                                                    conflictStatus === 'ok' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                                                        'bg-destructive/10 text-destructive'}`, children: [conflictStatus === 'checking' ? _jsx(Clock, { className: "w-4 h-4 mt-0.5 shrink-0" }) :
                                                    conflictStatus === 'conflict' ? _jsx(AlertCircle, { className: "w-4 h-4 mt-0.5 shrink-0" }) :
                                                        _jsx(CheckCircle2, { className: "w-4 h-4 mt-0.5 shrink-0" }), _jsx("span", { children: conflictStatus === 'checking' ? 'Checking for conflicts...' : conflictMessage })] })), successMessage && (_jsxs("div", { className: "p-4 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-sm flex items-center gap-2", children: [_jsx(CheckCircle2, { className: "w-4 h-4" }), successMessage] })), _jsx(Button, { className: "w-full h-12", disabled: conflictStatus === 'conflict' || conflictStatus === 'checking' || isSubmitting, isLoading: isSubmitting, children: "Request Booking" })] }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "text-base font-bold flex items-center gap-2", children: [_jsx(AlertCircle, { className: "w-4 h-4 text-primary" }), "Booking Policy"] }) }), _jsxs(CardContent, { className: "text-xs text-muted-foreground space-y-2", children: [_jsx("p", { children: "\u2022 Requests are subject to faculty/admin approval." }), _jsx("p", { children: "\u2022 Real-time conflict detection prevents double-booking." }), _jsx("p", { children: "\u2022 Cancellations must be made 24 hours in advance." })] })] })] }), _jsxs("div", { className: "lg:col-span-2 space-y-8", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-2xl font-bold tracking-tight", children: "Your Bookings" }), _jsxs("div", { className: "flex gap-2", children: [_jsxs(Button, { variant: "outline", size: "sm", className: "gap-2", children: [_jsx(Calendar, { className: "w-4 h-4" }), " Calendar View"] }), _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }), _jsx(Input, { className: "pl-9 h-9 w-48 text-xs", placeholder: "Search bookings..." })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 gap-4", children: [bookings.map((booking) => {
                                const resource = resources.find(r => r.id === booking.resourceId);
                                return (_jsx(Card, { className: "group hover:border-primary/30 transition-all", children: _jsxs(CardContent, { className: "p-5 flex flex-col md:flex-row md:items-center justify-between gap-6", children: [_jsxs("div", { className: "flex items-start gap-4", children: [_jsx("div", { className: "w-12 h-12 rounded-xl bg-accent flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors", children: _jsx(CalendarDays, { className: "w-6 h-6 text-muted-foreground group-hover:text-primary" }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-bold text-lg group-hover:text-primary transition-colors", children: booking.purpose || 'General Booking' }), _jsxs("div", { className: "flex flex-wrap items-center gap-y-1 gap-x-4 mt-1 text-sm text-muted-foreground", children: [_jsxs("span", { className: "flex items-center gap-1.5", children: [_jsx(Building2, { className: "w-3.5 h-3.5" }), " ", resource?.name || 'Loading...'] }), _jsxs("span", { className: "flex items-center gap-1.5", children: [_jsx(MapPin, { className: "w-3.5 h-3.5" }), " ", resource?.location || 'Unknown'] })] })] })] }), _jsxs("div", { className: "flex flex-col md:items-end gap-3 border-t md:border-t-0 pt-4 md:pt-0", children: [_jsxs("div", { className: "flex items-center gap-4 text-right", children: [_jsxs("div", { className: "text-xs", children: [_jsx("p", { className: "font-semibold", children: new Date(booking.startTime).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) }), _jsxs("p", { className: "text-muted-foreground", children: [new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), " - ", new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })] })] }), _jsx(Badge, { variant: booking.status === 'APPROVED' ? 'success' :
                                                                    booking.status === 'REJECTED' ? 'destructive' :
                                                                        booking.status === 'CANCELLED' ? 'secondary' :
                                                                            'warning', children: booking.status })] }), _jsxs(Button, { variant: "ghost", size: "sm", className: "text-xs h-8 group-hover:bg-primary group-hover:text-primary-foreground", children: ["Details ", _jsx(ChevronRight, { className: "w-3.5 h-3.5 ml-1" })] })] })] }) }, booking.id));
                            }), bookings.length === 0 && (_jsxs("div", { className: "py-20 text-center glass-card rounded-2xl", children: [_jsx(CalendarDays, { className: "w-12 h-12 text-muted-foreground/30 mx-auto mb-4" }), _jsx("h3", { className: "text-xl font-semibold mb-2", children: "No Bookings Yet" }), _jsx("p", { className: "text-muted-foreground mb-8", children: "Ready to secure a resource? Use the form on the left." }), _jsx(Button, { variant: "outline", onClick: () => document.querySelector('input')?.focus(), children: "Get Started" })] }))] })] })] }));
};
