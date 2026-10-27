
import { useMemo, useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import UsagePanel from '../components/UsagePanel';
import FlagList from '../components/FlagList';

function UsageHistory({ orgId }) {
  const { data, loading, error } = useFetch(
    `/usage?orgId=${orgId}&metric=api_calls`
  );

  if (loading && !data) {
    return <p className="text-secondary">Loading usage history...</p>;
  }

  if (error) {
    return <div className="alert alert-warning">{error.message}</div>;
  }

  const history = data?.history ?? [];
  const maxValue = Math.max(1, ...history.map((item) => item.quantity));

  return (
    <div>
      <h3 className="h6 mb-3">Recent usage history</h3>

      {history.length === 0 ? (
        <p className="text-secondary small">
          No usage history yet. Simulate an API call to start tracking usage.
        </p>
      ) : (
        <div className="d-flex align-items-end gap-3 border-bottom pb-2"
          style={{ minHeight: '190px' }}>
          {history.slice().reverse().map((item) => (
            <div
              key={item.period}
              className="d-flex flex-column align-items-center flex-fill"
              title={`${item.quantity} API calls`}
            >
              <span className="small mb-1">{item.quantity}</span>
              <div
                className="bg-primary rounded-top w-100"
                style={{
                  height: `${Math.max(6, (item.quantity / maxValue) * 120)}px`,
                  maxWidth: '55px',
                }}
              />
              <span className="small text-secondary mt-2 text-center">
                {new Date(item.period).toLocaleDateString(undefined, {
                  month: 'short',
                  year: '2-digit',
                })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function UsagePage() {
  const { data: orgs, loading, error, refetch } = useFetch('/orgs');
  const [selectedId, setSelectedId] = useState('');

  const selected = useMemo(
    () => orgs?.find((org) => org._id === selectedId) ?? orgs?.[0] ?? null,
    [orgs, selectedId]
  );

  if (loading && !orgs) {
    return <main className="container py-4">Loading analytics...</main>;
  }

  if (error) {
    return (
      <main className="container py-4">
        <div className="alert alert-danger">{error.message}</div>
      </main>
    );
  }

  if (!selected) {
    return (
      <main className="container py-4">
        <h2>Usage & Analytics</h2>
        <p>Create a team on the Dashboard to begin tracking usage.</p>
      </main>
    );
  }

  return (
    <main className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="h3 mb-1">Usage & Analytics</h2>
          <p className="text-secondary mb-0">
            Monitor API consumption and plan feature availability.
          </p>
        </div>

        <div>
          <label className="form-label small" htmlFor="analytics-team">
            Organisation
          </label>
          <select
            id="analytics-team"
            className="form-select"
            value={selected._id}
            onChange={(event) => setSelectedId(event.target.value)}
          >
            {orgs.map((org) => (
              <option key={org._id} value={org._id}>
                {org.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-lg-6">
          <section className="card h-100">
            <div className="card-body">
              <h3 className="h5">Monthly API usage</h3>
              <p className="text-secondary small">
                Your current plan: <strong>{selected.plan}</strong>
              </p>
              <UsagePanel
                key={selected._id}
                orgId={selected._id}
                plan={selected.plan}
              />
            </div>
          </section>
        </div>

        <div className="col-12 col-lg-6">
          <section className="card h-100">
            <div className="card-body">
              <UsageHistory key={selected._id} orgId={selected._id} />
            </div>
          </section>
        </div>

        <div className="col-12">
          <section className="card">
            <div className="card-body">
              <h3 className="h5">Plan features</h3>
              <p className="text-secondary small">
                Features currently enabled for this organisation.
              </p>
              <FlagList
                key={selected._id}
                orgId={selected._id}
                plan={selected.plan}
              />
            </div>
          </section>
        </div>
      </div>

      <button className="btn btn-outline-secondary btn-sm" onClick={refetch}>
        Refresh organisations
      </button>
    </main>
  );
}
