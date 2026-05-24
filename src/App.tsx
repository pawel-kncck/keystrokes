import { useEffect, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { FunctionPage } from './components/FunctionPage';
import { FUNCTIONS_BY_ID, GROUPS } from './functions';

const FIRST_ID = GROUPS[0].items[0].id;

function getIdFromHash(): string {
  const id = window.location.hash.replace(/^#\/?/, '');
  return id && FUNCTIONS_BY_ID[id] ? id : FIRST_ID;
}

export default function App() {
  const [selectedId, setSelectedId] = useState<string>(getIdFromHash);

  useEffect(() => {
    const onHashChange = () => setSelectedId(getIdFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const select = (id: string) => {
    setSelectedId(id);
    window.location.hash = `#/${id}`;
  };

  const fn = FUNCTIONS_BY_ID[selectedId] ?? FUNCTIONS_BY_ID[FIRST_ID];

  return (
    <div className="flex h-full bg-ink-950 text-ink-100">
      <Sidebar groups={GROUPS} selectedId={selectedId} onSelect={select} />
      <main className="flex-1 overflow-y-auto">
        <FunctionPage key={fn.id} fn={fn} />
      </main>
    </div>
  );
}
