
import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client';

export default function MembersPanel({ org, onChanged }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const [busy, setBusy] = useState(false);

  const canManage = ['owner', 'admin'].includes(org.role);

  const loadMembers = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const data = await api(`/orgs/${org._id}/members`);
      setMembers(data);
    } catch (err) {
      setError(err.message || 'Unable to load team members.');
    } finally {
      setLoading(false);
    }
  }, [org._id]);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  async function inviteMember(event) {
    event.preventDefault();
    setBusy(true);
    setError('');

    try {
      await api(`/orgs/${org._id}/invites`, {
        method: 'POST',
        body: { email: email.trim(), role },
      });

      setEmail('');
      await loadMembers();
      onChanged?.();
    } catch (err) {
      setError(err.message || 'Unable to invite this user.');
    } finally {
      setBusy(false);
    }
  }

  async function changeRole(userId, newRole) {
    setBusy(true);
    setError('');

    try {
      await api(`/orgs/${org._id}/members/${userId}/role`, {
        method: 'PATCH',
        body: { role: newRole },
      });

      await loadMembers();
    } catch (err) {
      setError(err.message || 'Unable to change member role.');
    } finally {
      setBusy(false);
    }
  }

  async function removeMember(userId, name) {
    if (!window.confirm(`Remove ${name || 'this member'} from the team?`)) {
      return;
    }

    setBusy(true);
    setError('');

    try {
      await api(`/orgs/${org._id}/members/${userId}`, {
        method: 'DELETE',
      });

      await loadMembers();
      onChanged?.();
    } catch (err) {
      setError(err.message || 'Unable to remove this member.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="bg-white rounded p-3 border mt-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="h6 mb-0">Team members</h3>
        <span className="badge text-bg-secondary">
          {members.length} member{members.length === 1 ? '' : 's'}
        </span>
      </div>

      {error && (
        <div className="alert alert-danger py-2" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-muted">Loading members...</p>
      ) : members.length === 0 ? (
        <p className="text-muted">No members found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-sm align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                {canManage && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {members.map((membership) => {
                const user = membership.user || {};
                const userId = user._id;
                const isOwner = membership.role === 'owner';

                return (
                  <tr key={userId || `${org._id}-${membership.role}`}>
                    <td>{user.name || 'Unknown user'}</td>
                    <td>{user.email || '—'}</td>
                    <td>
                      <span className="badge text-bg-light border">
                        {membership.role}
                      </span>
                    </td>

                    {canManage && (
                      <td>
                        {!isOwner && (
                          <div className="d-flex flex-wrap gap-2">
                            <select
                              className="form-select form-select-sm"
                              aria-label={`Role for ${user.name || user.email}`}
                              value={membership.role}
                              disabled={busy}
                              onChange={(event) =>
                                changeRole(userId, event.target.value)
                              }
                            >
                              <option value="member">Member</option>
                              <option value="admin">Admin</option>
                            </select>

                            <button
                              className="btn btn-sm btn-outline-danger"
                              disabled={busy}
                              onClick={() =>
                                removeMember(userId, user.name || user.email)
                              }
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {canManage && (
        <form onSubmit={inviteMember} className="border-top pt-3 mt-3">
          <h4 className="h6">Invite an existing user</h4>

          <div className="row g-2">
            <div className="col-12 col-md-6">
              <label htmlFor="member-email" className="form-label">
                Email address
              </label>
              <input
                id="member-email"
                className="form-control"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="teammate@example.com"
              />
            </div>

            <div className="col-12 col-md-3">
              <label htmlFor="member-role" className="form-label">
                Role
              </label>
              <select
                id="member-role"
                className="form-select"
                value={role}
                onChange={(event) => setRole(event.target.value)}
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="col-12 col-md-3 d-flex align-items-end">
              <button
                className="btn btn-dark w-100"
                type="submit"
                disabled={busy || !email.trim()}
              >
                {busy ? 'Please wait...' : 'Add member'}
              </button>
            </div>
          </div>

          <p className="form-text mb-0">
            The user must already have a Teamdesk account. Your plan's member
            limit is enforced by the server.
          </p>
        </form>
      )}
    </section>
  );
}
