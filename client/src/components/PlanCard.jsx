import PlanButton from './PlanButton';

// PROP DRILLING (level 2): still just forwarding org + onPlanChanged.
// Fix later by moving them into Context (see AuthContext for the pattern).
export default function PlanCard({ plan, org, onPlanChanged }) {
  const isCurrent = org.plan === plan.key;
  return (
    <div className={`plan-card p-4 h-100 d-flex flex-column ${isCurrent ? 'is-current' : ''}`}>
      <h3 className="text-lg font-semibold mb-1">{plan.label}</h3>
      <p className="text-3xl font-bold mb-2">${plan.price}<span className="text-sm font-normal text-gray-500">/mo</span></p>
      <ul className="list-unstyled small text-gray-600 flex-grow-1">
        <li>{plan.limits.api_calls.toLocaleString()} API calls / month</li>
        <li>Up to {plan.limits.members} team members</li>
      </ul>
      <PlanButton planKey={plan.key} org={org} onPlanChanged={onPlanChanged} />
    </div>
  );
}
