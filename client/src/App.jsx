import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import HooksLab from './pages/HooksLab';

export default function App() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState('dashboard');

  if (loading) return <div className="p-5 text-center"><div className="spinner-border" /></div>;
  if (!user) return <AuthPage />;

  return (
    <>
      <Navbar page={page} onNavigate={setPage} />
      {page === 'dashboard' ? <Dashboard /> : <HooksLab />}
    </>
  );
}
