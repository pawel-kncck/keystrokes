import { useCallback, useRef, useState } from 'react';
import type { EditorState, KeyEvent, LastChange } from '../lib/editor';
import { BufferView } from './EditorView';

type Props = {
  state: EditorState;
  change: LastChange;
  hint?: string;
  onKey: (e: KeyEvent) => void;
  onReset: () => void;
};

export function StepDemo({ state, change, hint, onKey, onReset }: Props) {
  const [focused, setFocused] = useState(false);
  const hostRef = useRef<HTMLDivElement>(null);

  const handleKey = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Tab') return;
      e.preventDefault();
      onKey({
        key: e.key,
        shiftKey: e.shiftKey,
        metaKey: e.metaKey,
        ctrlKey: e.ctrlKey,
        altKey: e.altKey,
      });
    },
    [onKey],
  );

  return (
    <div>
      <div
        ref={hostRef}
        tabIndex={0}
        onKeyDown={handleKey}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onClick={() => hostRef.current?.focus()}
        className={[
          'demo-caret-host relative w-full min-h-[180px] rounded-xl border bg-ink-950/60',
          'p-6 text-left font-mono text-[18px] leading-[1.7] tracking-[0.01em] text-ink-100',
          'outline-none transition-colors cursor-text',
          focused
            ? 'border-accent-500/70 shadow-[0_0_0_4px_rgba(56,189,248,0.08)]'
            : 'border-ink-700',
        ].join(' ')}
      >
        {!focused && state.text.length === 0 ? (
          <span className="text-ink-400 select-none">click here, then type…</span>
        ) : (
          <BufferView text={state.text} cursor={state.cursor} change={change} focused={focused} />
        )}
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-ink-400">
        <div>{hint ?? 'click the box and type — each keystroke walks the code below'}</div>
        <button
          type="button"
          onClick={onReset}
          className="px-2 py-1 rounded border border-ink-700 hover:border-ink-500 hover:text-ink-100 transition-colors"
        >
          reset
        </button>
      </div>
    </div>
  );
}
