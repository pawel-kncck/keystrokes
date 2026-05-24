import { useCallback, useEffect, useRef, useState } from 'react';
import { diff, type LastChange, type Reducer } from '../lib/editor';

type Props = {
  reducer: Reducer;
  /** Optional starting text */
  initialText?: string;
  /** Optional fixed cursor start position */
  initialCursor?: number;
  /** Help text shown beneath the editor */
  hint?: string;
};

export function EditorDemo({ reducer, initialText = '', initialCursor, hint }: Props) {
  const [state, setState] = useState(() => ({
    text: initialText,
    cursor: initialCursor ?? initialText.length,
  }));
  const [change, setChange] = useState<LastChange>({
    kind: 'noop',
    index: state.cursor,
    token: 0,
  });
  const [focused, setFocused] = useState(false);
  const tokenRef = useRef(0);
  const hostRef = useRef<HTMLDivElement>(null);

  const handleKey = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      // Allow tab to leave the demo, but capture everything else.
      if (e.key === 'Tab') return;
      e.preventDefault();
      const next = reducer(state, {
        key: e.key,
        shiftKey: e.shiftKey,
        metaKey: e.metaKey,
        ctrlKey: e.ctrlKey,
        altKey: e.altKey,
      });
      if (next === state) return;
      tokenRef.current += 1;
      setChange(diff(state, next, tokenRef.current));
      setState(next);
    },
    [reducer, state],
  );

  // Reset when reducer changes (i.e., when switching atomic functions).
  useEffect(() => {
    setState({ text: initialText, cursor: initialCursor ?? initialText.length });
    setChange({ kind: 'noop', index: initialCursor ?? initialText.length, token: 0 });
    tokenRef.current = 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducer]);

  const reset = () =>
    setState({ text: initialText, cursor: initialCursor ?? initialText.length });

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
          focused ? 'border-accent-500/70 shadow-[0_0_0_4px_rgba(56,189,248,0.08)]' : 'border-ink-700',
        ].join(' ')}
      >
        {!focused && state.text.length === 0 ? (
          <span className="text-ink-400 select-none">click here, then type…</span>
        ) : (
          <BufferView text={state.text} cursor={state.cursor} change={change} focused={focused} />
        )}
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-ink-400">
        <div>{hint ?? 'click the box and type to run the algorithm on each keystroke'}</div>
        <button
          type="button"
          onClick={reset}
          className="px-2 py-1 rounded border border-ink-700 hover:border-ink-500 hover:text-ink-100 transition-colors"
        >
          reset
        </button>
      </div>
    </div>
  );
}

function BufferView({
  text,
  cursor,
  change,
  focused,
}: {
  text: string;
  cursor: number;
  change: LastChange;
  focused: boolean;
}) {
  // Render: chars[0..cursor-1] + caret + chars[cursor..]
  const before = text.slice(0, cursor);
  const after = text.slice(cursor);

  return (
    <div className="whitespace-pre-wrap break-words">
      {[...before].map((ch, i) => (
        <Glyph key={`b-${i}`} ch={ch} flash={change.kind === 'insert' && change.index === i ? change.token : 0} />
      ))}
      <Caret visible={focused} moveToken={change.kind === 'move' ? change.token : 0} />
      {change.kind === 'delete' && (
        <Ghost ch={change.char ?? ''} key={`g-${change.token}`} />
      )}
      {[...after].map((ch, i) => (
        <Glyph key={`a-${i}`} ch={ch} flash={0} />
      ))}
    </div>
  );
}

function Glyph({ ch, flash }: { ch: string; flash: number }) {
  // re-mount on flash change to retrigger the animation
  return (
    <span
      key={flash}
      className={
        flash
          ? 'inline-block animate-[glyphIn_360ms_ease-out] text-accent-400'
          : 'inline-block'
      }
    >
      {ch === ' ' ? ' ' : ch}
    </span>
  );
}

function Caret({ visible, moveToken }: { visible: boolean; moveToken: number }) {
  if (!visible) return null;
  return (
    <span
      key={moveToken}
      aria-hidden
      className="inline-block w-[2px] h-[1.1em] -mb-[3px] bg-accent-500 align-baseline animate-[caretBlink_1s_steps(2)_infinite] mx-[1px]"
      style={moveToken ? { animation: 'caretMove 280ms ease-out, caretBlink 1s steps(2) infinite 280ms' } : undefined}
    />
  );
}

function Ghost({ ch }: { ch: string }) {
  return (
    <span
      aria-hidden
      className="inline-block text-red-400/80 line-through animate-[ghostOut_360ms_ease-out_forwards]"
    >
      {ch === ' ' ? ' ' : ch}
    </span>
  );
}
