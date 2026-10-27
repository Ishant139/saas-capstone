import { useState } from 'react';
import { api } from '../api/client';

// READ + UPDATE (rename) + DELETE for teams. Props: orgs, selectedId, onSelect, onChanged
export default function OrgList({ orgs, selectedId, onSelect, onChanged }) {
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState('');

  async function rename(id) {
    await api(`/orgs/${id}`, { method: 'PATCH', body: { name: draft } });
    setEditingId(null);
    onChanged();
  }

  async function remove(id) {
    if (!window.confirm('Delete this team and its memberships?')) return;
    await api(`/orgs/${id}`, { method: 'DELETE' });
    onChanged();
  }

  if (orgs.length === 0) return <p className="text-muted">No teams yet. Create your first one above.</p>;

  return (
    <ul className="list-group mb-3">
      {orgs.map((org) => (
        <li key={org._id} className={`list-group-item d-flex align-items-center gap-2 ${org._id === selectedId ? 'active' : ''}`}>
          {editingId === org._id ? (
            <>
              <input className="form-control form-control-sm" value={draft} onChange={(e) => setDraft(e.target.value)} />
              <button className="btn btn-sm btn-light" onClick={() => rename(org._id)}>Save</button>
            </>
          ) : (
            <>
              <button className="btn btn-link text-reset text-start flex-grow-1 p-0 text-decoration-none" onClick={() => onSelect(org._id)}>
                <span className="fw-semibold">{org.name}</span>
                <span className="ms-2 small opacity-75">{org.plan} plan, {org.memberCount} member{org.memberCount === 1 ? '' : 's'}</span>
              </button>
              {org.role !== 'member' && (
                <button className="btn btn-sm btn-outline-secondary" onClick={() => { setEditingId(org._id); setDraft(org.name); }}>Rename</button>
              )}
              {org.role === 'owner' && <button className="btn btn-sm btn-outline-danger" onClick={() => remove(org._id)}>Delete</button>}
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
