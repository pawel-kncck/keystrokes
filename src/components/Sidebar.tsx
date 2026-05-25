import type { FunctionGroup } from '../types';

type Props = {
  groups: FunctionGroup[];
  selectedId: string;
  onSelect: (id: string) => void;
  open: boolean;
  onClose: () => void;
};

export function Sidebar({ groups, selectedId, onSelect, open, onClose }: Props) {
  return (
    <>
      {/* backdrop on mobile when open */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={[
          'fixed inset-0 z-20 bg-black/50 md:hidden transition-opacity',
          open ? 'opacity-100' : 'opacity-0 pointer-events-none',
        ].join(' ')}
      />

      <aside
        className={[
          'fixed md:static inset-y-0 left-0 z-30 w-64 shrink-0',
          'border-r border-ink-800 bg-ink-900/95 md:bg-ink-900/60 backdrop-blur md:backdrop-blur-0',
          'flex flex-col transition-transform duration-200 ease-out',
          open ? 'translate-x-0' : '-translate-x-full md:hidden',
        ].join(' ')}
        aria-hidden={!open}
      >
        <div className="px-5 py-5 border-b border-ink-800 flex items-start justify-between gap-2">
          <div>
            <div className="text-[15px] font-semibold text-ink-50">Keystrokes</div>
            <div className="text-xs text-ink-400 mt-0.5">atomic editor functions</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Collapse sidebar"
            className="text-ink-400 hover:text-ink-100 -mr-1 -mt-1 p-1 rounded transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-2">
          {groups.map((group) => (
            <div key={group.id} className="px-2 py-2">
              <div className="px-3 pb-1 text-[10px] uppercase tracking-[0.18em] text-ink-400">
                {group.label}
              </div>
              <ul className="flex flex-col">
                {group.items.map((fn) => {
                  const active = fn.id === selectedId;
                  return (
                    <li key={fn.id}>
                      <button
                        type="button"
                        onClick={() => onSelect(fn.id)}
                        className={[
                          'w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors',
                          active
                            ? 'bg-accent-500/10 text-accent-400'
                            : 'text-ink-300 hover:bg-ink-800/60 hover:text-ink-100',
                        ].join(' ')}
                      >
                        {fn.title}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
        <footer className="px-5 py-3 border-t border-ink-800 text-[11px] text-ink-400">
          click a function to view its demo + code
        </footer>
      </aside>
    </>
  );
}
