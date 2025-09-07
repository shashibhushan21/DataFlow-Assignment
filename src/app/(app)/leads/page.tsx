import LeadsTable from './leads-table';

export default function LeadsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
        <p className="text-muted-foreground">
          Manage and track all your potential customers.
        </p>
      </div>
      <LeadsTable />
    </div>
  );
}
