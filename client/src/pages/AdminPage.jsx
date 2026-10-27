
import { useFetch } from '../hooks/useFetch';

export default function AdminPage() {
  const { data: orgs, loading, error, refetch } = useFetch('/orgs');

  if (loading && !orgs) {
    return <main className="container py-4">Loading overview...</main>;
  }

  if (error) {
    return (
      <main className="container py-4">
        <div className="alert alert-danger">{error.message}</div>
      </main>
    );
  }

  const organisations = orgs ?? [];
  const members = organisations.reduce(
    (total, org) => total + (org.memberCount ?? 0),
    0
  );

  const plans = organisations.reduce((counts, org) => {
    const plan = org.plan ?? 'unknown';
    counts[plan] = (counts[plan] ?? 0) + 1;
    return counts;
  }, {});

  return (
    <main className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="h3 mb-1">Admin Overview</h2>
          <p className="text-secondary mb-0">
            Summary of organisations you belong to.
          </p>
        </div>

        <button className="btn btn-outline-secondary" onClick={refetch}>
          Refresh
        </button>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <p className="text-secondary mb-1">Organisations</p>
              <div className="fs-2 fw-bold">{organisations.length}</div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <p className="text-secondary mb-1">Memberships across organisations</p>
              <div className="fs-2 fw-bold">{members}</div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <p className="text-secondary mb-1">Plans in use</p>
              <div className="fs-2 fw-bold">{Object.keys(plans).length}</div>
            </div>
          </div>
        </div>
      </div>

      <section className="card">
        <div className="card-body">
          <h3 className="h5">Organisation summary</h3>

          {organisations.length === 0 ? (
            <p className="text-secondary mb-0">
              No organisations found. Create one from the Dashboard.
            </p>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Organisation</th>
                    <th>Your role</th>
                    <th>Plan</th>
                    <th>Members</th>
                    <th>Subscription</th>
                  </tr>
                </thead>
                <tbody>
                  {organisations.map((org) => (
                    <tr key={org._id}>
                      <td>{org.name}</td>
                      <td>{org.role ?? '—'}</td>
                      <td>
                        <span className="badge text-bg-primary">
                          {org.plan}
                        </span>
                      </td>
                      <td>{org.memberCount ?? 0}</td>
                      <td>{org.subscriptionStatus ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
