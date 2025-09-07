"use client";

import React, { useState, useMemo } from 'react';
import type { Lead } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import LeadDetailSheet from './lead-detail-sheet';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLeads } from '@/hooks/queries/use-leads';
import { useUIStore } from '@/store/ui-store';
import { Search } from 'lucide-react';

const statusColors = {
  pending: 'bg-gray-500/20 text-gray-500 shadow-inner',
  contacted: 'bg-blue-500/20 text-blue-500 shadow-inner shadow-blue-500/50',
  responded: 'bg-yellow-500/20 text-yellow-500 shadow-inner shadow-yellow-500/50',
  converted: 'bg-green-500/20 text-green-500 shadow-inner shadow-green-500/50',
};

function LeadsSkeleton() {
  const isMobile = useIsMobile();
  if (isMobile) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }
  return Array.from({ length: 5 }).map((_, i) => (
      <TableRow key={i}>
          <TableCell>
              <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32" />
                  </div>
              </div>
          </TableCell>
          <TableCell>
              <Skeleton className="h-6 w-20 rounded-full" />
          </TableCell>
          <TableCell>
              <Skeleton className="h-4 w-28" />
          </TableCell>
          <TableCell>
              <Skeleton className="h-4 w-24" />
          </TableCell>
      </TableRow>
  ));
}

export default function LeadsTable() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const isMobile = useIsMobile();
  const { leadsFilter, setLeadsFilter } = useUIStore();
  
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useLeads({ search: leadsFilter });

  const leads = useMemo(() => {
    return data?.pages.flatMap(page => page.data) || [];
  }, [data]);

  const handleSelectLead = (lead: Lead) => {
    setSelectedLead(lead);
  };

  const handleLoadMore = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };
  
  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-destructive">Error loading leads: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (isMobile) {
    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>All Leads</CardTitle>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search leads..."
                        value={leadsFilter}
                        onChange={(e) => setLeadsFilter(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                    {isLoading ? <LeadsSkeleton /> : leads.map((lead) => (
                        <motion.div 
                            key={lead.id}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            onClick={() => handleSelectLead(lead)}
                        >
                            <Card className="bg-muted/30 cursor-pointer">
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={lead.avatar} alt={lead.name} />
                                            <AvatarFallback>{lead.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium">{lead.name}</div>
                                            <div className="text-sm text-muted-foreground">{lead.email}</div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="text-sm text-muted-foreground">
                                    <div className="flex justify-between">
                                        <span>Status:</span>
                                        <Badge variant="outline" className={cn("border-transparent text-xs", statusColors[lead.status])}>
                                            {lead.status}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between mt-2">
                                        <span>Campaign:</span>
                                        <span className="font-medium text-foreground">No Campaign</span>
                                    </div>
                                    <div className="flex justify-between mt-2">
                                        <span>Last Contacted:</span>
                                        <span className="font-medium text-foreground">{lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'Never'}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                    {isFetchingNextPage && (
                        <div className="space-y-4">
                            {Array.from({ length: 2 }).map((_, i) => (
                                <Card key={i}>
                                    <CardHeader>
                                        <div className="flex items-center gap-3">
                                            <Skeleton className="h-10 w-10 rounded-full" />
                                            <div className="space-y-1">
                                                <Skeleton className="h-4 w-24" />
                                                <Skeleton className="h-3 w-32" />
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <Skeleton className="h-4 w-1/2" />
                                        <Skeleton className="h-4 w-1/3" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                    </div>
                </CardContent>
                {hasNextPage && (
                    <CardFooter className="pt-6 text-center">
                        <Button onClick={handleLoadMore} disabled={isFetchingNextPage} variant="outline" className="w-full">
                            {isFetchingNextPage ? "Loading..." : "Load More"}
                        </Button>
                    </CardFooter>
                )}
            </Card>
            {selectedLead && (
                <LeadDetailSheet
                    lead={selectedLead}
                    isOpen={!!selectedLead}
                    onOpenChange={(isOpen) => {
                        if (!isOpen) {
                        setSelectedLead(null);
                        }
                    }}
                />
            )}
        </>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>All Leads</CardTitle>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search leads..."
              value={leadsFilter}
              onChange={(e) => setLeadsFilter(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Last Contacted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="space-y-1">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-3 w-32" />
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-6 w-20 rounded-full" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-4 w-28" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-4 w-24" />
                        </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <AnimatePresence>
                    {leads.map((lead, index) => (
                      <TableRow 
                          key={lead.id}
                          className="cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => handleSelectLead(lead)}
                      >
                          <TableCell>
                              <div className="flex items-center gap-3">
                              <Avatar>
                                  <AvatarImage src={`https://picsum.photos/id/${1010 + lead.id}/100/100`} alt={lead.name} />
                                  <AvatarFallback>{lead.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                  <div className="font-medium">{lead.name}</div>
                                  <div className="text-sm text-muted-foreground">{lead.email}</div>
                              </div>
                              </div>
                          </TableCell>
                          <TableCell>
                              <Badge variant="outline" className={cn("border-transparent", statusColors[lead.status])}>
                              {lead.status}
                              </Badge>
                          </TableCell>
                          <TableCell>No Campaign</TableCell>
                          <TableCell>{lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'Never'}</TableCell>
                      </TableRow>
                    ))}
                  </AnimatePresence>
                )}
                {isFetchingNextPage && Array.from({ length: 2 }).map((_, i) => (
                  <TableRow key={`loading-${i}`}>
                      <TableCell>
                          <div className="flex items-center gap-3">
                              <Skeleton className="h-10 w-10 rounded-full" />
                              <div className="space-y-1">
                                  <Skeleton className="h-4 w-24" />
                                  <Skeleton className="h-3 w-32" />
                              </div>
                          </div>
                      </TableCell>
                      <TableCell>
                          <Skeleton className="h-6 w-20 rounded-full" />
                      </TableCell>
                      <TableCell>
                          <Skeleton className="h-4 w-28" />
                      </TableCell>
                      <TableCell>
                          <Skeleton className="h-4 w-24" />
                      </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {hasNextPage && (
            <CardFooter className="pt-6 text-center">
                <Button onClick={handleLoadMore} disabled={isFetchingNextPage} variant="outline">
                    {isFetchingNextPage ? "Loading..." : "Load More"}
                </Button>
            </CardFooter>
          )}
        </CardContent>
      </Card>
      {selectedLead && (
        <LeadDetailSheet
          lead={selectedLead}
          isOpen={!!selectedLead}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setSelectedLead(null);
            }
          }}
        />
      )}
    </>
  );
}
