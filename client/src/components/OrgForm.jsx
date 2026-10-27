import { useRef, useState } from 'react';
import { api } from '../api/client';

// CREATE. Controlled input (useState) + useRef to refocus after submit.
export default function OrgForm({ onCreated }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await api('/orgs', { method: 'POST', body: { name } });
      setName('');
      inputRef.current.focus();
      onCreated();
    } catch (err) {
      setError(err.details?.[0]?.message || err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="d-flex gap-2 mb-2">
      <input ref={inputRef} className="form-control" placeholder="New team name" value={name} onChange={(e) => setName(e.target.value)} />
      <button className="btn btn-dark text-nowrap">Create team</button>
      {error && <div className="text-danger small align-self-center">{error}</div>}
    </form>
  );
}
