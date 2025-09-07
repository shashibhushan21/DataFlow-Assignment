import CampaignStats from './campaign-stats';
import CampaignsTable from './campaigns-table';

export default function CampaignsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
        <p className="text-muted-foreground">
          Monitor and analyze your marketing campaigns.
        </p>
      </div>
      <CampaignStats />
      <CampaignsTable />
    </div>
  );
}
