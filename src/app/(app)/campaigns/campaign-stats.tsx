"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useCampaigns } from '@/hooks/queries/use-campaigns';
import { BarChart3, Users, TrendingUp, Target } from 'lucide-react';

export default function CampaignStats() {
  const { data } = useCampaigns();
  const campaigns = data?.data || [];

  const stats = {
    total: campaigns.length || 0,
    active: campaigns.filter(c => c.status === 'active').length || 0,
    totalLeads: campaigns.reduce((sum, c) => sum + (Number(c.totalLeads) || 0), 0),
    avgResponseRate: campaigns.length > 0 
      ? campaigns.reduce((sum, c) => sum + (Number(c.responseRate) || 0), 0) / campaigns.length 
      : 0,
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.active}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalLeads}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Response Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isNaN(stats.avgResponseRate) ? '0.0' : stats.avgResponseRate.toFixed(1)}%</div>
          <Progress value={isNaN(stats.avgResponseRate) ? 0 : stats.avgResponseRate} className="mt-2" />
        </CardContent>
      </Card>
    </div>
  );
}