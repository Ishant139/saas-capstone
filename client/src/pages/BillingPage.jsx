
import { useMemo, useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import PlanSection from '../components/PlanSection';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '₹0',
    description: 'For small teams getting started.',
    features: ['Up to 2 members', 'Basic usage limits', 'Core team management'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '₹999',
    description: 'For growing teams.',
    features: ['Up to 10 members', 'Higher usage limits', 'More plan features'],
  },
  {
    id: 'business',
    name: 'Business',
    price: '₹2,999',
    description: 'For larger organisations.',
    features: ['Up to 100 members', 'Higher usage allowances', 'Business features'],
  },
];

export default function BillingPage() {
  const { data: orgs, loading, error, refetch } = useFetch('/orgs');
  const [selectedId, setSelectedId] = useState('');

  const selected = useMemo(
    () => orgs?.find((org) => org._id === selectedId) ?? orgs?.[0] ?? null,
    [orgs, selectedId]
  );

  if (loading && !orgs) {
    return <main className="container py-4">Loading billing information...</main>;
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
        <h2>Billing & Plans</h2>
        <p>Create a team in Dashboard before managing its subscription.</p>
      </main>
    );
  }

  return (
    <main className="container py-4">
      <h2 className="h3 mb-2">Billing & Plans</h2>
      <p className="text-secondary">
        Review your subscription and choose a plan for your team.
      </p>

      <label className="form-label" htmlFor="billing-team">
        Organisation
      </label>
      <select
        id="billing-team"
        className="form-select mb-4"
        value={selected._id}
        onChange={(event) => setSelectedId(event.target.value)}
      >
        {orgs.map((org) => (
          <option key={org._id} value={org._id}>
            {org.name}
          </option>
        ))}
      </select>

      <div className="row g-3 mb-4">
        {plans.map((plan) => {
          const current = selected.plan === plan.id;

          return (
            <div className="col-12 col-md-4" key={plan.id}>
              <div className={`card h-100 ${current ? 'border-primary shadow-sm' : ''}`}>
                <div className="card-body d-flex flex-column">
                  {current && (
                    <span className="badge text-bg-primary align-self-start mb-2">
                      Current plan
                    </span>
                  )}
                  <h3 className="h5">{plan.name}</h3>
                  <div className="fs-3 fw-bold">{plan.price}</div>
                  <p className="small text-secondary">{plan.description}</p>
                  <ul className="small ps-3">
                    {plan.features.map((feature) => (
                      <li className="mb-2" key={feature}>{feature}</li>
                    ))}
                  </ul>
                  <div className="mt-auto">
                    {current && (
                      <button className="btn btn-outline-primary w-100" disabled>
                        Current plan
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <section className="card">
        <div className="card-body">
          <h3 className="h5">Manage subscription</h3>
          <p className="small text-secondary">
            Plan changes use your existing subscription API. Payment processing
            is not enabled yet.
          </p>
          <PlanSection org={selected} onPlanChanged={refetch} />
        </div>
      </section>
    </main>
  );
}
