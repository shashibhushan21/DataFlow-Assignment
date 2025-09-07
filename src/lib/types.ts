export type Lead = {
  id: number;
  name: string;
  email: string;
  company?: string;
  campaign_id?: number;
  status: 'pending' | 'contacted' | 'responded' | 'converted';
  source?: string;
  last_contacted?: Date;
  notes?: string;
  created_at: Date;
  updated_at: Date;
  campaign?: Campaign;
};

export type Campaign = {
  id: number;
  name: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  total_leads: number;
  successful_leads: number;
  response_rate: string;
  created_at: Date;
  updated_at: Date;
  leads?: Lead[];
};
