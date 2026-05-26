import type { LastChange } from '../lib/editor';

type Props = {
  text: string;
  cursor: number;
  change: LastChange;
  focused: boolean;
};

export function BufferView({ text, cursor, change, focused }: Props) {
  const before = text.slice(0, cursor);
  const after = text.slice(cursor);

  return (
    <div className="whitespace-pre-wrap break-words">
      {[...before].map((ch, i) => (
        <Glyph
          key={`b-${i}`}
          ch={ch}
          flash={change.kind === 'insert' && change.index === i ? change.token : 0}
        />
      ))}
      <Caret visible={focused} moveToken={change.kind === 'move' ? change.token : 0} />
      {change.kind === 'delete' && <Ghost ch={change.char ?? ''} key={`g-${change.token}`} />}
      {[...after].map((ch, i) => (
        <Glyph key={`a-${i}`} ch={ch} flash={0} />
      ))}
    </div>
  );
}

function Glyph({ ch, flash }: { ch: string; flash: number }) {
  return (
    <span
      key={flash}
      className={
        flash
          ? 'inline-block animate-[glyphIn_360ms_ease-out] text-accent-400'
          : 'inline-block'
      }
    >
      {ch === ' ' ? ' ' : ch}
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
      style={
        moveToken
          ? { animation: 'caretMove 280ms ease-out, caretBlink 1s steps(2) infinite 280ms' }
          : undefined
      }
    />
  );
}

function Ghost({ ch }: { ch: string }) {
  return (
    <span
      aria-hidden
      className="inline-block text-red-400/80 line-through animate-[ghostOut_360ms_ease-out_forwards]"
    >
      {ch === ' ' ? ' ' : ch}
    </span>
  );
}
