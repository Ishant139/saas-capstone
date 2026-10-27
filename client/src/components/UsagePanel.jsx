import { useState } from 'react';
import { api } from '../api/client';
import { useFetch } from '../hooks/useFetch';

// Quota demo: each click is one "API call" for the team. At the limit the server answers 429.
export default function UsagePanel({ orgId, plan }) {
  const { data, loading, refetch } = useFetch(`/usage?orgId=${orgId}&metric=api_calls`);
  const [message, setMessage] = useState('');

  async function track() {
    setMessage('');
    try {
      await api('/usage/track', { method: 'POST', body: { orgId, metric: 'api_calls' } });
    } catch (err) {
      setMessage(err.status === 429 ? `${err.message}. Upgrade the ${plan} plan to keep going.` : err.message);
    }
    refetch();
  }

  if (loading && !data) return <div className="spinner-border spinner-border-sm" />;
  const pct = Math.min(100, Math.round((data.used / data.limit) * 100));

  return (
    <div>
      <div className="d-flex justify-content-between small mb-1">
        <span>API calls this month</span>
        <span>{data.used.toLocaleString()} / {data.limit.toLocaleString()}</span>
      </div>
      <div className={`usage-bar ${pct >= 100 ? 'is-full' : ''}`}><span style={{ width: `${pct}%` }} /></div>
      <button className="btn btn-sm btn-outline-dark mt-3" onClick={track}>Simulate API call</button>
      {message && <div className="alert alert-warning mt-3 mb-0 py-2">{message}</div>}
    </div>
  );
}
