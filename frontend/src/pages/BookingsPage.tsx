import React, { useState, useEffect } from 'react';
import { 
  CalendarDays, 
  Search, 
  Plus, 
  Clock, 
  MapPin, 
  AlertCircle, 
  CheckCircle2,
  Calendar,
  ChevronRight,
  Building2
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useAuthStore } from '../store/useAuthStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Label } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { apiRequest, getAuthHeaders } from '../services/api';
import { Booking } from '../types';

export const BookingsPage = () => {
  const { resources, bookings, fetchBookings, fetchNotifications, fetchAdminData } = useAppStore();
  const { token, user } = useAuthStore();

  const [selectedResourceId, setSelectedResourceId] = useState('');
  const [purpose, setPurpose] = useState('');
  const [startTime, setStartTime] = useState(new Date(Date.now() + 3600000).toISOString().slice(0, 16));
  const [endTime, setEndTime] = useState(new Date(Date.now() + 7200000).toISOString().slice(0, 16));
  
  const [conflictStatus, setConflictStatus] = useState<'idle' | 'checking' | 'ok' | 'conflict' | 'error'>('idle');
  const [conflictMessage, setConflictMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Initial resource selection
  useEffect(() => {
    if (resources.length > 0 && !selectedResourceId) {
      setSelectedResourceId(resources[0].id);
    }
  }, [resources, selectedResourceId]);

  // Conflict detection
  useEffect(() => {
    if (!token || !selectedResourceId || !startTime || !endTime) return;
    
    const checkConflict = async () => {
      setConflictStatus('checking');
      try {
        const params = new URLSearchParams({
          resourceId: selectedResourceId,
          startTime: new Date(startTime).toISOString(),
          endTime: new Date(endTime).toISOString()
        });
        const data = await apiRequest<{ conflict: boolean; message: string }>(
          `/bookings/conflicts/check?${params.toString()}`, 
          { headers: getAuthHeaders(token) }
        );
        setConflictStatus(data.conflict ? 'conflict' : 'ok');
        setConflictMessage(data.message);
      } catch (error: any) {
        setConflictStatus('error');
        setConflictMessage(error.message);
      }
    };

    const timer = setTimeout(checkConflict, 500);
    return () => clearTimeout(timer);
  }, [selectedResourceId, startTime, endTime, token]);

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (conflictStatus === 'conflict' || !token) return;

    setIsSubmitting(true);
    setSuccessMessage('');

    try {
      await apiRequest<Booking>('/bookings', {
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
      
      // Refresh data
      await Promise.all([
        fetchBookings(token),
        fetchNotifications(token),
        fetchAdminData(token, user?.role === 'ADMIN')
      ]);
    } catch (error: any) {
      setConflictStatus('error');
      setConflictMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Booking Form */}
      <div className="lg:col-span-1 space-y-8">
        <Card className="border-primary/20 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              New Booking Request
            </CardTitle>
            <CardDescription>Reserve a campus facility or equipment</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateBooking} className="space-y-6">
              <div className="space-y-2">
                <Label>Select Resource</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all"
                  value={selectedResourceId}
                  onChange={(e) => setSelectedResourceId(e.target.value)}
                  required
                >
                  {resources.map((r) => (
                    <option key={r.id} value={r.id}>{r.name} ({r.type})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Input 
                    type="datetime-local" 
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Time</Label>
                  <Input 
                    type="datetime-local" 
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Purpose / Description</Label>
                <Input 
                  placeholder="e.g. CS101 Lab Session" 
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  required
                />
              </div>

              {/* Conflict Alert */}
              {conflictStatus !== 'idle' && (
                <div className={`p-4 rounded-lg flex items-start gap-3 text-sm transition-all ${
                  conflictStatus === 'checking' ? 'bg-accent/30 text-muted-foreground animate-pulse' :
                  conflictStatus === 'conflict' ? 'bg-destructive/10 text-destructive border border-destructive/20' :
                  conflictStatus === 'ok' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                  'bg-destructive/10 text-destructive'
                }`}>
                  {conflictStatus === 'checking' ? <Clock className="w-4 h-4 mt-0.5 shrink-0" /> :
                   conflictStatus === 'conflict' ? <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> :
                   <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />}
                  <span>{conflictStatus === 'checking' ? 'Checking for conflicts...' : conflictMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="p-4 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  {successMessage}
                </div>
              )}

              <Button 
                className="w-full h-12" 
                disabled={conflictStatus === 'conflict' || conflictStatus === 'checking' || isSubmitting}
                isLoading={isSubmitting}
              >
                Request Booking
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-primary" />
              Booking Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-2">
            <p>• Requests are subject to faculty/admin approval.</p>
            <p>• Real-time conflict detection prevents double-booking.</p>
            <p>• Cancellations must be made 24 hours in advance.</p>
          </CardContent>
        </Card>
      </div>

      {/* Bookings List/Calendar Visualization */}
      <div className="lg:col-span-2 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Your Bookings</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar className="w-4 h-4" /> Calendar View
            </Button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input className="pl-9 h-9 w-48 text-xs" placeholder="Search bookings..." />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {bookings.map((booking) => {
            const resource = resources.find(r => r.id === booking.resourceId);
            return (
              <Card key={booking.id} className="group hover:border-primary/30 transition-all">
                <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                      <CalendarDays className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                        {booking.purpose || 'General Booking'}
                      </h3>
                      <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> {resource?.name || 'Loading...'}</span>
                        <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {resource?.location || 'Unknown'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end gap-3 border-t md:border-t-0 pt-4 md:pt-0">
                    <div className="flex items-center gap-4 text-right">
                       <div className="text-xs">
                         <p className="font-semibold">{new Date(booking.startTime).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                         <p className="text-muted-foreground">{new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                       </div>
                       <Badge 
                        variant={
                          booking.status === 'APPROVED' ? 'success' : 
                          booking.status === 'REJECTED' ? 'destructive' : 
                          booking.status === 'CANCELLED' ? 'secondary' :
                          'warning'
                        }
                       >
                         {booking.status}
                       </Badge>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs h-8 group-hover:bg-primary group-hover:text-primary-foreground">
                      Details <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {bookings.length === 0 && (
            <div className="py-20 text-center glass-card rounded-2xl">
              <CalendarDays className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Bookings Yet</h3>
              <p className="text-muted-foreground mb-8">Ready to secure a resource? Use the form on the left.</p>
              <Button variant="outline" onClick={() => (document.querySelector('input') as HTMLInputElement)?.focus()}>
                Get Started
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
