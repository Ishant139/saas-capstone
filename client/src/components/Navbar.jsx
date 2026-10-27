import { useAuth } from '../context/AuthContext';

// Bootstrap navbar + Tailwind utility classes mixed together.
export default function Navbar({ page, onNavigate }) {
  const { user, logout } = useAuth();
  const tabs = [['dashboard', 'Dashboard']];

  return (
    <nav className="navbar navbar-expand bg-white border-bottom px-3">
      <span className="navbar-brand fw-bold text-teal-700" style={{ color: 'var(--accent)' }}>Teamdesk</span>
      <ul className="navbar-nav me-auto">
        {tabs.map(([key, label]) => (
          <li className="nav-item" key={key}>
            <button className={`nav-link btn btn-link ${page === key ? 'active fw-semibold' : ''}`} onClick={() => onNavigate(key)}>
              {label}
            </button>
          </li>
        ))}
      </ul>
      {user && (
        <div className="d-flex align-items-center gap-3">
          <span className="text-sm text-gray-600">{user.name}</span>
          <button className="btn btn-sm btn-outline-secondary" onClick={logout}>Log out</button>
        </div>
      )}
    </nav>
  );
}
