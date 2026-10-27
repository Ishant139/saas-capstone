import {
  createContext, forwardRef, memo, useCallback, useContext, useDeferredValue, useEffect, useId,
  useImperativeHandle, useLayoutEffect, useMemo, useReducer, useRef, useState, useSyncExternalStore, useTransition,
} from 'react';

// A study page: one small card per hook, all in one file. Open it in the app (Hooks lab tab).
const Card = ({ title, note, children }) => (
  <div className="col-12 col-md-6 col-xl-4">
    <div className="bg-white border rounded p-3 h-100">
      <h3 className="h6 mb-0">{title}</h3>
      <p className="small text-muted">{note}</p>
      {children}
    </div>
  </div>
);

// 1. useState
function StateDemo() {
  const [count, setCount] = useState(0);
  return <button className="btn btn-sm btn-primary" onClick={() => setCount((c) => c + 1)}>Clicked {count}</button>;
}

// 2. useReducer
function reducer(state, action) {
  if (action === 'inc') return { n: state.n + 1 };
  if (action === 'dec') return { n: state.n - 1 };
  return { n: 0 };
}
function ReducerDemo() {
  const [state, dispatch] = useReducer(reducer, { n: 0 });
  return (
    <div className="d-flex gap-2 align-items-center">
      <button className="btn btn-sm btn-outline-dark" onClick={() => dispatch('dec')}>-</button>
      <strong>{state.n}</strong>
      <button className="btn btn-sm btn-outline-dark" onClick={() => dispatch('inc')}>+</button>
      <button className="btn btn-sm btn-link" onClick={() => dispatch('reset')}>reset</button>
    </div>
  );
}

// 3. useEffect (side effect + cleanup)
function EffectDemo() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id); // cleanup on unmount
  }, []);
  return <span>Open for {seconds}s</span>;
}

// 4. useLayoutEffect (runs before the browser paints: good for measuring)
function LayoutDemo() {
  const boxRef = useRef(null);
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => { setWidth(boxRef.current.getBoundingClientRect().width); }, []);
  return <div ref={boxRef} className="p-2 bg-light border rounded">This box is {Math.round(width)}px wide</div>;
}

// 5. useRef (DOM access + a value that survives renders without causing one)
function RefDemo() {
  const inputRef = useRef(null);
  const renders = useRef(0);
  renders.current += 1;
  return (
    <>
      <input ref={inputRef} className="form-control form-control-sm mb-2" placeholder="Type here" />
      <button className="btn btn-sm btn-outline-dark" onClick={() => inputRef.current.focus()}>Focus input</button>
      <span className="ms-2 small text-muted">renders: {renders.current}</span>
    </>
  );
}

// 6. useMemo (cache an expensive calculation)
function MemoDemo() {
  const [n, setN] = useState(10);
  const [dark, setDark] = useState(false);
  const primes = useMemo(() => {
    const out = [];
    for (let i = 2; out.length < n; i++) if (out.every((p) => i % p !== 0)) out.push(i);
    return out;
  }, [n]); // not recomputed when only `dark` changes
  return (
    <div className={dark ? 'p-2 bg-dark text-white rounded' : 'p-2'}>
      <input type="range" min="5" max="50" value={n} onChange={(e) => setN(+e.target.value)} />
      <div className="small">First {n} primes: {primes.join(', ')}</div>
      <button className="btn btn-sm btn-secondary mt-2" onClick={() => setDark(!dark)}>Toggle theme</button>
    </div>
  );
}

// 7. useCallback + memo (stable function => child skips re-render)
const Child = memo(function Child({ onPing }) {
  const renders = useRef(0);
  renders.current += 1;
  return <button className="btn btn-sm btn-outline-dark" onClick={onPing}>Ping (child renders: {renders.current})</button>;
});
function CallbackDemo() {
  const [text, setText] = useState('');
  const [pings, setPings] = useState(0);
  const onPing = useCallback(() => setPings((p) => p + 1), []);
  return (
    <>
      <input className="form-control form-control-sm mb-2" placeholder="Typing does not re-render Child" value={text} onChange={(e) => setText(e.target.value)} />
      <Child onPing={onPing} /> <span className="small">pings: {pings}</span>
    </>
  );
}

// 8. useContext (no prop drilling needed)
const ThemeContext = createContext('light');
function ThemedLabel() {
  const theme = useContext(ThemeContext);
  return <span className={`badge ${theme === 'light' ? 'text-bg-light border' : 'text-bg-dark'}`}>theme from context: {theme}</span>;
}
function ContextDemo() {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={theme}>
      <ThemedLabel />
      <button className="btn btn-sm btn-link" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>switch</button>
    </ThemeContext.Provider>
  );
}

// 9. useId (unique ids for label + input, safe with SSR)
function IdDemo() {
  const id = useId();
  return (
    <>
      <label htmlFor={id} className="form-label small">Email</label>
      <input id={id} className="form-control form-control-sm" />
      <div className="small text-muted mt-1">generated id: {id}</div>
    </>
  );
}

// 10. useTransition + useDeferredValue (keep typing responsive on heavy lists)
const ITEMS = Array.from({ length: 3000 }, (_, i) => `Item ${i + 1}`);
function TransitionDemo() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('');
  const [isPending, startTransition] = useTransition();
  const deferred = useDeferredValue(filter);
  const shown = useMemo(() => ITEMS.filter((x) => x.includes(deferred)).slice(0, 5), [deferred]);
  return (
    <>
      <input className="form-control form-control-sm" placeholder="Filter 3000 items" value={query}
        onChange={(e) => { setQuery(e.target.value); startTransition(() => setFilter(e.target.value)); }} />
      <div className="small mt-1">{isPending ? 'Updating...' : shown.join(', ')}</div>
    </>
  );
}

// 11. forwardRef + useImperativeHandle (expose only chosen methods to the parent)
const FancyInput = forwardRef(function FancyInput(props, ref) {
  const inner = useRef(null);
  useImperativeHandle(ref, () => ({ focus: () => inner.current.focus(), clear: () => { inner.current.value = ''; } }));
  return <input ref={inner} className="form-control form-control-sm" placeholder="Controlled from parent" />;
});
function ImperativeDemo() {
  const ref = useRef(null);
  return (
    <>
      <FancyInput ref={ref} />
      <button className="btn btn-sm btn-outline-dark mt-2 me-2" onClick={() => ref.current.focus()}>focus()</button>
      <button className="btn btn-sm btn-outline-dark mt-2" onClick={() => ref.current.clear()}>clear()</button>
    </>
  );
}

// 12. useSyncExternalStore (subscribe to something outside React: the browser's online status)
const subscribe = (cb) => {
  window.addEventListener('online', cb);
  window.addEventListener('offline', cb);
  return () => { window.removeEventListener('online', cb); window.removeEventListener('offline', cb); };
};
function ExternalStoreDemo() {
  const online = useSyncExternalStore(subscribe, () => navigator.onLine);
  return <span className={`badge ${online ? 'text-bg-success' : 'text-bg-danger'}`}>{online ? 'online' : 'offline'}</span>;
}

export default function HooksLab() {
  return (
    <div className="container py-4">
      <h2 className="h5 mb-3">Hooks lab</h2>
      <div className="row g-3">
        <Card title="useState" note="Local state."><StateDemo /></Card>
        <Card title="useReducer" note="State transitions in one function."><ReducerDemo /></Card>
        <Card title="useEffect" note="Side effects + cleanup."><EffectDemo /></Card>
        <Card title="useLayoutEffect" note="Measure before paint."><LayoutDemo /></Card>
        <Card title="useRef" note="DOM access and mutable values."><RefDemo /></Card>
        <Card title="useMemo" note="Cache expensive results."><MemoDemo /></Card>
        <Card title="useCallback + memo" note="Stable function identity."><CallbackDemo /></Card>
        <Card title="useContext" note="Share values without drilling props."><ContextDemo /></Card>
        <Card title="useId" note="Unique ids for accessibility."><IdDemo /></Card>
        <Card title="useTransition + useDeferredValue" note="Keep the UI responsive."><TransitionDemo /></Card>
        <Card title="useImperativeHandle" note="Expose a small API through a ref."><ImperativeDemo /></Card>
        <Card title="useSyncExternalStore" note="Subscribe to external data. Try going offline."><ExternalStoreDemo /></Card>
      </div>
      <p className="small text-muted mt-3">Also used elsewhere in the app: useDebugValue (hooks/useFetch.js) and a custom hook (useFetch).</p>
    </div>
  );
}
