import { useMemo, useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import OrgForm from '../components/OrgForm';
import OrgList from '../components/OrgList';
import PlanSection from '../components/PlanSection';
import UsagePanel from '../components/UsagePanel';
import FlagList from '../components/FlagList';

export default function Dashboard() {
  const { data: orgs, loading, error, refetch } = useFetch('/orgs');
  const [selectedId, setSelectedId] = useState(null);

  // useMemo: derive the selected org (fall back to the first one)
  const selected = useMemo(() => orgs?.find((o) => o._id === selectedId) ?? orgs?.[0] ?? null, [orgs, selectedId]);

  if (loading && !orgs) return <div className="container py-4"><div className="spinner-border" /></div>;
  if (error) return <div className="container py-4"><div className="alert alert-danger">{error.message}</div></div>;

  return (
    <div className="container py-4">
      <div className="row g-4">
        <div className="col-12 col-lg-5">
          <h2 className="h5">Your teams</h2>
          <OrgForm onCreated={refetch} />
          <OrgList orgs={orgs} selectedId={selected?._id} onSelect={setSelectedId} onChanged={refetch} />
        </div>

        {selected && (
          <div className="col-12 col-lg-7">
            <h2 className="h5">{selected.name}: subscription</h2>
            <p className="small text-muted">
              Status: <strong>{selected.subscriptionStatus}</strong>
              {selected.trialEndsAt && selected.subscriptionStatus === 'trialing' && ` (trial ends ${new Date(selected.trialEndsAt).toLocaleDateString()})`}
            </p>
            {/* prop drilling starts here: org + refetch travel 3 levels down */}
            <PlanSection org={selected} onPlanChanged={refetch} />

            <div className="row g-3 mt-1">
              <div className="col-12 col-md-6"><div className="bg-white rounded p-3 border"><h3 className="h6">Usage</h3><UsagePanel orgId={selected._id} plan={selected.plan} /></div></div>
              <div className="col-12 col-md-6"><div className="bg-white rounded p-3 border"><h3 className="h6">Features on your plan</h3><FlagList orgId={selected._id} plan={selected.plan} /></div></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
