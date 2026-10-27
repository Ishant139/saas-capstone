
import { useAuth } from '../context/AuthContext';

export default function Navbar({ page, onNavigate }) {
  const { user, logout } = useAuth();

  const tabs = [
    ['dashboard', 'Dashboard'],
    ['members', 'Team Members'],
    ['billing', 'Billing & Plans'],
    ['usage', 'Usage & Analytics'],
    ['settings', 'Account Settings'],
  ];

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom px-3 py-3">
      <div className="container-fluid">
        <button
          className="navbar-brand fw-bold border-0 bg-transparent"
          style={{ color: 'var(--accent)' }}
          onClick={() => onNavigate('dashboard')}
        >
          Teamdesk
        </button>

        <div className="d-flex flex-wrap align-items-center gap-2">
          {tabs.map(([key, label]) => (
            <button
              key={key}
              type="button"
              className={`btn btn-sm ${
                page === key
                  ? 'btn-primary'
                  : 'btn-outline-secondary'
              }`}
              onClick={() => onNavigate(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {user && (
          <div className="d-flex align-items-center gap-3 ms-auto ps-3">
            <span className="small text-secondary">{user.name}</span>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={logout}
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
