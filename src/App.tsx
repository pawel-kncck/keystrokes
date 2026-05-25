import { useEffect, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { FunctionPage } from './components/FunctionPage';
import { FUNCTIONS_BY_ID, GROUPS } from './functions';

const FIRST_ID = GROUPS[0].items[0].id;
const MOBILE_BREAKPOINT = 768;

function getIdFromHash(): string {
  const id = window.location.hash.replace(/^#\/?/, '');
  return id && FUNCTIONS_BY_ID[id] ? id : FIRST_ID;
}

function isDesktop(): boolean {
  return typeof window !== 'undefined' && window.innerWidth >= MOBILE_BREAKPOINT;
}

export default function App() {
  const [selectedId, setSelectedId] = useState<string>(getIdFromHash);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(isDesktop);

  useEffect(() => {
    const onHashChange = () => setSelectedId(getIdFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const select = (id: string) => {
    setSelectedId(id);
    window.location.hash = `#/${id}`;
    if (!isDesktop()) setSidebarOpen(false);
  };

  const fn = FUNCTIONS_BY_ID[selectedId] ?? FUNCTIONS_BY_ID[FIRST_ID];

  return (
    <div className="flex h-full bg-ink-950 text-ink-100">
      <Sidebar
        groups={GROUPS}
        selectedId={selectedId}
        onSelect={select}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <main className="flex-1 overflow-y-auto min-w-0">
        <div className="sticky top-0 z-10 flex items-center gap-3 px-4 py-3 border-b border-ink-800 bg-ink-950/85 backdrop-blur">
          <button
            type="button"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Open sidebar'}
            aria-expanded={sidebarOpen}
            className="inline-flex items-center justify-center size-9 rounded-md text-ink-300 hover:text-ink-100 hover:bg-ink-800/60 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <div className="text-sm font-medium text-ink-200 md:hidden">Keystrokes</div>
        </div>
        <FunctionPage key={fn.id} fn={fn} />
      </main>
    </div>
  );
}
