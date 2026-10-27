import { useState } from 'react';
import { api } from '../api/client';

const ORDER = ['free', 'pro', 'business'];

// PROP DRILLING (level 3): the component that finally uses the props.
export default function PlanButton({ planKey, org, onPlanChanged }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const canChange = org.role === 'owner' || org.role === 'admin';

  if (org.plan === planKey) return <button className="btn btn-success" disabled>Current plan</button>;
  const label = ORDER.indexOf(planKey) > ORDER.indexOf(org.plan) ? 'Upgrade' : 'Downgrade';

  async function change() {
    setBusy(true);
    setError('');
    try {
      await api('/billing/checkout-session', { method: 'POST', body: { orgId: org._id, plan: planKey } });
      onPlanChanged();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button className="btn btn-dark" disabled={busy || !canChange} onClick={change}>{busy ? 'Working...' : label}</button>
      {!canChange && <div className="small text-muted mt-1">Only owners and admins can change plans.</div>}
      {error && <div className="small text-danger mt-1">{error}</div>}
    </>
  );
}
