import { create } from 'zustand';

interface UIState {
  sidebarCollapsed: boolean;
  selectedLeads: string[];
  selectedCampaigns: string[];
  leadsFilter: string;
  campaignsFilter: string;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSelectedLeads: (leads: string[]) => void;
  setSelectedCampaigns: (campaigns: string[]) => void;
  setLeadsFilter: (filter: string) => void;
  setCampaignsFilter: (filter: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  selectedLeads: [],
  selectedCampaigns: [],
  leadsFilter: '',
  campaignsFilter: '',
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setSelectedLeads: (leads) => set({ selectedLeads: leads }),
  setSelectedCampaigns: (campaigns) => set({ selectedCampaigns: campaigns }),
  setLeadsFilter: (filter) => set({ leadsFilter: filter }),
  setCampaignsFilter: (filter) => set({ campaignsFilter: filter }),
}));