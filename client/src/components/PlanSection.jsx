import { useFetch } from '../hooks/useFetch';
import PlanCard from './PlanCard';

// PROP DRILLING (level 1): org + onPlanChanged are not used here,
// they are only passed down to PlanCard -> PlanButton.
export default function PlanSection({ org, onPlanChanged }) {
  const { data: plans, loading, error } = useFetch('/billing/plans');

  if (loading) return <div className="spinner-border spinner-border-sm" role="status" />;
  if (error) return <div className="alert alert-danger">{error.message}</div>;

  return (
    <div className="row g-3">
      {plans.map((plan) => (
        <div className="col-12 col-md-4" key={plan.key}>
          <PlanCard plan={plan} org={org} onPlanChanged={onPlanChanged} />
        </div>
      ))}
    </div>
  );
}
