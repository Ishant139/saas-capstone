import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const { authenticate } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  // One handler for all inputs: computed property names
  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setError('');
    try {
      await authenticate(mode, mode === 'login' ? { email: form.email, password: form.password } : form);
    } catch (err) {
      setError(err.details?.map((d) => d.message).join('. ') || err.message);
    }
  }

  return (
    <div className="container" style={{ maxWidth: 420 }}>
      <div className="bg-white rounded-lg shadow p-4 mt-5">
        <h1 className="h4 mb-3">{mode === 'login' ? 'Log in to Teamdesk' : 'Create your account'}</h1>
        <form onSubmit={submit} className="d-grid gap-3">
          {mode === 'register' && <input className="form-control" name="name" placeholder="Full name" value={form.name} onChange={onChange} />}
          <input className="form-control" name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} />
          <input className="form-control" name="password" type="password" placeholder="Password (8+ characters)" value={form.password} onChange={onChange} />
          {error && <div className="alert alert-danger py-2 mb-0">{error}</div>}
          <button className="btn btn-dark">{mode === 'login' ? 'Log in' : 'Create account'}</button>
        </form>
        <button className="btn btn-link p-0 mt-3" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
          {mode === 'login' ? 'Need an account? Register' : 'Already registered? Log in'}
        </button>
      </div>
    </div>
  );
}
