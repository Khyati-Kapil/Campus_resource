import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Users, 
  Search, 
  Plus, 
  Settings2,
  Trash2,
  Edit2,
  Grid,
  List
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useAuthStore } from '../store/useAuthStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';

export const ResourcesPage = () => {
  const { resources, loadingStates } = useAppStore();
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const isAdmin = user?.role === 'ADMIN';

  const filteredResources = resources.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resource Registry</h1>
          <p className="text-muted-foreground mt-1">Browse and manage all campus facilities and equipment.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-accent/30 p-1 rounded-lg mr-2">
            <Button 
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
              size="icon" 
              className="h-8 w-8"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
              size="icon" 
              className="h-8 w-8"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
          {isAdmin && (
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> Add Resource
            </Button>
          )}
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          className="pl-10 h-12" 
          placeholder="Search by name, type, or building..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loadingStates.resources === 'loading' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 rounded-2xl bg-accent/20 animate-pulse border border-border" />
          ))}
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "space-y-4"
        }>
          {filteredResources.map((resource) => (
            <Card key={resource.id} className="group hover:border-primary/50 transition-all overflow-hidden flex flex-col">
              <div className="h-24 bg-gradient-to-br from-primary/10 to-accent/20 flex items-center justify-center relative">
                <div className="absolute top-4 right-4 flex gap-2">
                  <Badge variant="secondary" className="bg-background/80 backdrop-blur-md">
                    {resource.type}
                  </Badge>
                </div>
                <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Building2 className="text-primary w-6 h-6" />
                </div>
              </div>
              <CardHeader className="flex-1">
                <CardTitle>{resource.name}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                  <MapPin className="w-3.5 h-3.5" /> {resource.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Users className="w-3.5 h-3.5" /> Capacity: {resource.capacity} people
                </div>
              </CardHeader>
              <CardFooter className="bg-accent/10 border-t border-border flex justify-between">
                <Button variant="ghost" size="sm" className="text-xs group-hover:text-primary">
                  View Availability
                </Button>
                {isAdmin && (
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                )}
              </CardFooter>
            </Card>
          ))}

          {filteredResources.length === 0 && (
            <div className="col-span-full py-32 text-center">
              <Building2 className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
              <h3 className="text-xl font-bold">No Resources Found</h3>
              <p className="text-muted-foreground">Adjust your search or add a new resource.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
