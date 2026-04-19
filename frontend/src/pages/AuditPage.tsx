import React from 'react';
import { 
  FileSearch, 
  Download, 
  Search, 
  Calendar,
  User,
  Activity,
  ArrowRight,
  Shield
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useAuthStore } from '../store/useAuthStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { apiRequest, getAuthHeaders } from '../services/api';

export const AuditPage = () => {
  const { auditLogs, loadingStates } = useAppStore();
  const { token } = useAuthStore();

  const exportCsv = async () => {
    if (!token) return;
    try {
      const csv = await apiRequest<string>('/audit?export=csv', {
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
    } catch (error: any) {
      alert('Export failed: ' + error.message);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Shield className="text-primary w-8 h-8" />
            Audit Governance
          </h1>
          <p className="text-muted-foreground mt-1">Immutable record of all system activities and administrative actions.</p>
        </div>
        
        <Button variant="outline" className="gap-2 h-11" onClick={exportCsv}>
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      <Card className="border-border/50">
        <CardHeader className="border-b border-border/50 bg-accent/5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div className="flex items-center gap-2">
               <Activity className="w-4 h-4 text-primary" />
               <CardTitle className="text-lg">Activity Stream</CardTitle>
             </div>
             <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
               <Input className="pl-9 w-72 h-9 bg-background" placeholder="Filter logs by action or user..." />
             </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-accent/10 border-b border-border/50">
                <tr>
                  <th className="px-6 py-4 font-semibold">Action</th>
                  <th className="px-6 py-4 font-semibold">Entity Type</th>
                  <th className="px-6 py-4 font-semibold">Entity ID</th>
                  <th className="px-6 py-4 font-semibold">Actor</th>
                  <th className="px-6 py-4 font-semibold text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-accent/20 transition-colors group">
                    <td className="px-6 py-4 font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        {log.action}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="bg-accent/30">{log.entityType}</Badge>
                    </td>
                    <td className="px-6 py-4 font-mono text-[10px] text-muted-foreground">
                      {log.entityId}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 opacity-40" />
                        <span className="text-xs">{log.actorId.slice(-8).toUpperCase()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-muted-foreground">
                      <div className="flex flex-col items-end">
                        <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {new Date(log.createdAt).toLocaleDateString()}</span>
                        <span className="text-[10px]">{new Date(log.createdAt).toLocaleTimeString()}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {loadingStates.audit === 'loading' && (
            <div className="p-12 text-center text-muted-foreground animate-pulse">
              Syncing audit logs from blockchain...
            </div>
          )}

          {auditLogs.length === 0 && loadingStates.audit !== 'loading' && (
            <div className="py-24 text-center">
              <FileSearch className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
              <h3 className="text-xl font-bold">No Audit Records</h3>
              <p className="text-muted-foreground">Wait for system activity to populate this list.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
