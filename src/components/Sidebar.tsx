import type { FunctionGroup } from '../types';

type Props = {
  groups: FunctionGroup[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export function Sidebar({ groups, selectedId, onSelect }: Props) {
  return (
    <aside className="w-64 shrink-0 border-r border-ink-800 bg-ink-900/60 flex flex-col">
      <div className="px-5 py-5 border-b border-ink-800">
        <div className="text-[15px] font-semibold text-ink-50">Keystrokes</div>
        <div className="text-xs text-ink-400 mt-0.5">atomic editor functions</div>
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
  );
}
