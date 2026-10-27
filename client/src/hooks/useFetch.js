import { useCallback, useDebugValue, useEffect, useState } from 'react';
import { api } from '../api/client';

// Custom hook = reusable stateful logic. Handles loading / error / data / refetch / cancel.
export function useFetch(path) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const [tick, setTick] = useState(0);
  useDebugValue(state.loading ? 'loading' : 'ready');

  useEffect(() => {
    if (!path) return;
    const controller = new AbortController(); // cancel the request if the component unmounts
    setState((s) => ({ ...s, loading: true, error: null }));
    api(path, { signal: controller.signal })
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((error) => { if (error.name !== 'AbortError') setState({ data: null, loading: false, error }); });
    return () => controller.abort(); // cleanup function
  }, [path, tick]);

  const refetch = useCallback(() => setTick((t) => t + 1), []);
  return { ...state, refetch };
}
