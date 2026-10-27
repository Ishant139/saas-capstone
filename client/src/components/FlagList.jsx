import { useFetch } from '../hooks/useFetch';

// Feature gating: the server only returns flags enabled for this plan.
export default function FlagList({ orgId, plan }) {
  const { data: flags, loading } = useFetch(`/orgs/${orgId}/flags?plan=${plan}`); // plan in URL = refetch on plan change
  if (loading && !flags) return null;
  if (!flags?.length) return <p className="small text-muted mb-0">No feature flags yet. Run <code>npm run seed</code> in /server.</p>;
  return (
    <ul className="list-unstyled mb-0">
      {flags.map((f) => (
        <li key={f.key} className="d-flex gap-2 py-1">
          <span className="badge text-bg-success">on</span>
          <span><code>{f.key}</code> <span className="text-muted small">{f.description}</span></span>
        </li>
      ))}
    </ul>
  );
}
