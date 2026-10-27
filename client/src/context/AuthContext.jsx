import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

// useReducer: all auth state changes go through one function.
function reducer(state, action) {
  switch (action.type) {
    case 'LOADED': return { user: action.user, loading: false };
    case 'LOGOUT': return { user: null, loading: false };
    default: return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { user: null, loading: true });

  // useEffect: on first render, restore the session from the saved token.
  useEffect(() => {
    if (!localStorage.getItem('token')) return dispatch({ type: 'LOADED', user: null });
    api('/auth/me')
      .then(({ user }) => dispatch({ type: 'LOADED', user }))
      .catch(() => { localStorage.removeItem('token'); dispatch({ type: 'LOGOUT' }); });
  }, []);

  // useCallback: stable function identities between renders.
  const authenticate = useCallback(async (mode, form) => {
    const { token, user } = await api(`/auth/${mode}`, { method: 'POST', body: form });
    localStorage.setItem('token', token);
    dispatch({ type: 'LOADED', user });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  }, []);

  // useMemo: the context value only changes when its inputs change.
  const value = useMemo(() => ({ ...state, authenticate, logout }), [state, authenticate, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// useContext wrapped in a custom hook
export const useAuth = () => useContext(AuthContext);
