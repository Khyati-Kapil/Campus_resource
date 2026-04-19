import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Filter,
  MoreHorizontal,
  User,
  Calendar,
  MessageSquare,
  ChevronDown
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useAuthStore } from '../store/useAuthStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { apiRequest, getAuthHeaders } from '../services/api';
import { BookingStatus } from '../types';

export const ApprovalsPage = () => {
  const { bookings, resources, fetchBookings, fetchNotifications, fetchAdminData } = useAppStore();
  const { token, user } = useAuthStore();
  
  const [filter, setFilter] = useState<BookingStatus | 'ALL'>('PENDING');
  const [searchTerm, setSearchTerm] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const filteredBookings = bookings.filter(b => {
    const matchesStatus = filter === 'ALL' ? true : b.status === filter;
    const matchesSearch = (b.purpose || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    if (!token) return;

    const reason = window.prompt(
      `Please provide a reason for ${action === 'approve' ? 'approval' : 'rejection'}:`,
      action === 'approve' ? 'Meets facility usage policy' : 'Resource unavailable for this time'
    );

    if (reason === null) return; // User cancelled

    setProcessingId(id);
    try {
      await apiRequest(`/bookings/${id}/${action}`, {
        method: 'PATCH',
        headers: getAuthHeaders(token),
        body: JSON.stringify({ reason })
      });
      
      // Refresh
      await Promise.all([
        fetchBookings(token),
        fetchNotifications(token),
        fetchAdminData(token, user?.role === 'ADMIN')
      ]);
    } catch (error: any) {
      alert(`Failed to ${action}: ${error.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Approval Workflow</h1>
          <p className="text-muted-foreground mt-1">Review and manage resource allocation requests.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              className="pl-9 w-64" 
              placeholder="Search by purpose or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" /> Filters
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-accent/30 rounded-xl w-fit">
        {['PENDING', 'APPROVED', 'REJECTED', 'ALL'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === tab 
                ? 'bg-card text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.charAt(0) + tab.slice(1).toLowerCase()}
            {tab !== 'ALL' && (
              <span className="ml-2 opacity-60">
                ({bookings.filter(b => b.status === tab).length})
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredBookings.map((booking) => {
          const resource = resources.find(r => r.id === booking.resourceId);
          return (
            <Card key={booking.id} className="group overflow-hidden border-border/50 hover:border-primary/30 transition-all">
              <div className="flex flex-col lg:flex-row items-stretch">
                {/* Status Indicator Bar */}
                <div className={`w-1 lg:w-1.5 shrink-0 ${
                  booking.status === 'APPROVED' ? 'bg-emerald-500' :
                  booking.status === 'REJECTED' ? 'bg-destructive' :
                  'bg-amber-500'
                }`} />

                <div className="flex-1 p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-all">
                        <Calendar className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-lg">{booking.purpose || 'Campus Resource Request'}</h3>
                          <Badge variant="outline" className="text-[10px] uppercase">{booking.id.slice(-6)}</Badge>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary/60" /> {new Date(booking.startTime).toLocaleString()}</div>
                          <div className="flex items-center gap-2"><User className="w-4 h-4 text-primary/60" /> ID: {booking.requesterId.slice(-8).toUpperCase()}</div>
                          <div className="flex items-center gap-2 font-medium text-foreground"><CheckCircle2 className="w-4 h-4 text-primary/60" /> {resource?.name || 'Loading Resource...'}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end lg:self-center">
                      {booking.status === 'PENDING' ? (
                        <>
                          <Button 
                            variant="outline" 
                            className="text-destructive hover:bg-destructive/10 border-destructive/20 h-10 px-6 gap-2"
                            onClick={() => handleAction(booking.id, 'reject')}
                            isLoading={processingId === booking.id}
                          >
                            <XCircle className="w-4 h-4" /> Reject
                          </Button>
                          <Button 
                            className="bg-emerald-600 hover:bg-emerald-500 text-white h-10 px-6 gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                            onClick={() => handleAction(booking.id, 'approve')}
                            isLoading={processingId === booking.id}
                          >
                            <CheckCircle2 className="w-4 h-4" /> Approve
                          </Button>
                        </>
                      ) : (
                        <div className="flex items-center gap-6">
                           {booking.approvalReason && (
                             <div className="hidden xl:flex items-center gap-2 text-xs text-muted-foreground bg-accent/30 px-3 py-1.5 rounded-lg border border-border/50 max-w-xs truncate">
                               <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                               <span className="italic">"{booking.approvalReason}"</span>
                             </div>
                           )}
                           <Badge 
                             variant={booking.status === 'APPROVED' ? 'success' : 'destructive'}
                             className="h-10 px-6 text-sm"
                           >
                             {booking.status}
                           </Badge>
                           <Button variant="ghost" size="icon" className="text-muted-foreground">
                             <MoreHorizontal className="w-4 h-4" />
                           </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}

        {filteredBookings.length === 0 && (
          <div className="py-24 text-center border border-dashed border-border rounded-2xl">
            <Clock className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-1">Queue Empty</h3>
            <p className="text-muted-foreground">No bookings found matching the current filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};
