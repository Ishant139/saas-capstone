
import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import BillingPage from './pages/BillingPage';
import UsagePage from './pages/UsagePage';
import AdminPage from './pages/AdminPage';
import MembersPanel from './components/MembersPanel';
import { useFetch } from './hooks/useFetch';

function MembersPage() {
  const {
    data: orgs,
    loading,
    error,
    refetch,
  } = useFetch('/orgs');

  const [selectedId, setSelectedId] = useState(null);

  const selected =
    orgs?.find((org) => org._id === selectedId) ??
    orgs?.[0] ??
    null;

  if (loading && !orgs) {
    return (
      <main className="container py-4">
        <div className="spinner-border" role="status" />
        <span className="ms-2">Loading teams...</span>
      </main>
    );
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
        <h2 className="h4">Team Members</h2>
        <p>Create a team on the Dashboard before managing its members.</p>
      </main>
    );
  }

  return (
    <main className="container py-4">
      <h2 className="h4 mb-3">Team Members</h2>

      <label className="form-label" htmlFor="team-select">
        Select team
      </label>

      <select
        id="team-select"
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

      <MembersPanel org={selected} onChanged={refetch} />
    </main>
  );
}

function PlaceholderPage({ title, description }) {
  return (
    <main className="container py-4">
      <h2 className="h4 mb-2">{title}</h2>
      <p className="text-secondary">{description}</p>

      <div className="alert alert-info">
        This section is under development. More functionality will be
        added in a future development step.
      </div>
    </main>
  );
}

export default function App() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState('dashboard');

  if (loading) {
    return (
      <div className="p-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const pages = {
    dashboard: <Dashboard />,
    members: <MembersPage />,
    billing: <BillingPage />,
    usage: <UsagePage />,
    settings: (
      <PlaceholderPage
        title="Account Settings"
        description="Manage your profile and account preferences."
      />
    ),
    admin: <AdminPage />,
  };

  return (
    <>
      <Navbar page={page} onNavigate={setPage} />
      {pages[page] ?? pages.dashboard}
    </>
  );
}
