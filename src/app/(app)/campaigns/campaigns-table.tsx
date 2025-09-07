"use client";

import { useState } from 'react';
import type { Campaign } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { useCampaigns } from '@/hooks/queries/use-campaigns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, ArrowUpDown, Edit, Play, Pause, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';

const statusColors = {
  draft: 'bg-gray-500/20 text-gray-500 shadow-inner',
  active: 'bg-green-500/20 text-green-500 shadow-inner shadow-green-500/50',
  paused: 'bg-yellow-500/20 text-yellow-500 shadow-inner shadow-yellow-500/50',
  completed: 'bg-purple-500/20 text-purple-500 shadow-inner shadow-purple-500/50',
};

type SortKey = keyof Campaign;
type SortDirection = 'asc' | 'desc';

function CampaignsSkeleton() {
    const isMobile = useIsMobile();
    if (isMobile) {
        return (
            <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/4" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    return Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
            <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
            <TableCell><Skeleton className="h-2 w-full rounded-full" /></TableCell>
            <TableCell><Skeleton className="h-8 w-8 rounded-md" /></TableCell>
        </TableRow>
    ));
}

export default function CampaignsTable() {
    const [sortKey, setSortKey] = useState<SortKey>('created_at');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
    const isMobile = useIsMobile();
    
    const { data, isLoading, error } = useCampaigns();
    const campaigns = data?.data || [];

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    };

    const sortedCampaigns = [...campaigns].sort((a, b) => {
        if (a[sortKey] < b[sortKey]) return sortDirection === 'asc' ? -1 : 1;
        if (a[sortKey] > b[sortKey]) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    if (error) {
        return (
            <Card>
                <CardContent className="p-6">
                    <p className="text-destructive">Error loading campaigns: {error.message}</p>
                </CardContent>
            </Card>
        );
    }

    const SortableHeader = ({ tkey, label }: { tkey: SortKey, label: string }) => (
        <button 
            onClick={() => handleSort(tkey)} 
            className="-ml-4 flex items-center gap-2 px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
        >
            {label}
            <ArrowUpDown className={cn("h-4 w-4", sortKey === tkey ? "text-foreground" : "text-muted-foreground/50")} />
        </button>
    )
    
    if (isMobile) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>All Campaigns</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? <CampaignsSkeleton /> : (
                        <div className="space-y-4">
                            {sortedCampaigns.map((campaign) => (
                                <Card key={campaign.id} className="bg-muted/30">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-lg">{campaign.name}</CardTitle>
                                                <Badge variant="outline" className={cn("border-transparent mt-2", statusColors[campaign.status])}>
                                                    {campaign.status}
                                                </Badge>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                                                    {campaign.status === 'Active' && <DropdownMenuItem><Pause className="mr-2 h-4 w-4" /> Pause</DropdownMenuItem>}
                                                    {campaign.status === 'Paused' && <DropdownMenuItem><Play className="mr-2 h-4 w-4" /> Resume</DropdownMenuItem>}
                                                    <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="text-sm text-muted-foreground space-y-2">
                                        <div className="flex justify-between"><span>Start Date:</span> <span className="font-medium text-foreground">{campaign.startDate}</span></div>
                                        <div className="flex justify-between"><span>Leads:</span> <span className="font-medium text-foreground">{campaign.leads}</span></div>
                                        <div>
                                            <div className="flex justify-between mb-1">
                                                <span>Response Rate:</span>
                                                <span className="font-mono text-xs font-medium text-foreground">{campaign.responseRate}%</span>
                                            </div>
                                            <Progress value={campaign.responseRate} className="h-2" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        );
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Campaigns</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead><SortableHeader tkey="name" label="Campaign" /></TableHead>
                    <TableHead><SortableHeader tkey="status" label="Status" /></TableHead>
                    <TableHead><SortableHeader tkey="startDate" label="Start Date" /></TableHead>
                    <TableHead><SortableHeader tkey="leads" label="Leads" /></TableHead>
                    <TableHead className="w-[20%]"><SortableHeader tkey="responseRate" label="Response Rate" /></TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? <CampaignsSkeleton /> : sortedCampaigns.map((campaign) => (
                        <TableRow key={campaign.id} className="hover:bg-muted/40">
                            <TableCell className="font-medium">{campaign.name}</TableCell>
                            <TableCell>
                                <Badge variant="outline" className={cn("border-transparent", statusColors[campaign.status])}>
                                {campaign.status}
                                </Badge>
                            </TableCell>
                            <TableCell>{campaign.startDate}</TableCell>
                            <TableCell>{campaign.leads}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Progress value={campaign.responseRate} className="h-2" />
                                    <span className="text-xs text-muted-foreground font-mono">{campaign.responseRate}%</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                                        {campaign.status === 'Active' && <DropdownMenuItem><Pause className="mr-2 h-4 w-4" /> Pause</DropdownMenuItem>}
                                        {campaign.status === 'Paused' && <DropdownMenuItem><Play className="mr-2 h-4 w-4" /> Resume</DropdownMenuItem>}
                                        <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
      </CardContent>
    </Card>
  );
}
