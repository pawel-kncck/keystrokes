import { useEffect, useMemo, useRef, useState } from 'react';
import { getHighlighter } from '../lib/highlighter';
import type { Binding, TraceStep } from '../lib/trace';

type Props = {
  code: string;
  trace: TraceStep[] | null;
  stepIdx: number;
};

export function SteppedCode({ code, trace, stepIdx }: Props) {
  const [html, setHtml] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    getHighlighter().then((hl) => {
      if (cancelled) return;
      let out = hl.codeToHtml(code, { lang: 'javascript', theme: 'github-dark-dimmed' });
      // Add a 1-based data-line attribute to every line span so we can toggle
      // the active one without re-running shiki.
      let i = 1;
      out = out.replace(
        /<span class="(line[^"]*)">/g,
        (_, cls) => `<span class="${cls}" data-line="${i++}">`,
      );
      // Strip whitespace between line spans so `.line { display: block }`
      // doesn't create double line breaks inside the <pre>.
      out = out.replace(/(<\/span>)\s+(<span class="line)/g, '$1$2');
      setHtml(out);
    });
    return () => {
      cancelled = true;
    };
  }, [code]);

  const safeIdx = trace && trace.length > 0 ? Math.min(stepIdx, trace.length - 1) : -1;
  const current = safeIdx >= 0 && trace ? trace[safeIdx] : null;
  const activeLine = current?.line ?? null;
  const note = current?.note ?? null;

  // Toggle the .is-active class on the right line span.
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    root.querySelectorAll('.line.is-active').forEach((el) => el.classList.remove('is-active'));
    if (activeLine != null) {
      const el = root.querySelector(`.line[data-line="${activeLine}"]`);
      el?.classList.add('is-active');
    }
  }, [activeLine, html]);

  // Accumulate bindings up to (and including) the current step. Map preserves
  // insertion order, so the rendered list grows downward as steps advance.
  const bindings = useMemo<Binding[]>(() => {
    if (!trace || safeIdx < 0) return [];
    const map = new Map<string, Binding>();
    for (let s = 0; s <= safeIdx; s++) {
      for (const b of trace[s].add ?? []) {
        map.set(b.name, b);
      }
    }
    return Array.from(map.values());
  }, [trace, safeIdx]);

  return (
    <div className="rounded-lg border border-ink-700 bg-ink-900/80 overflow-hidden stepped-code">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-ink-700 text-xs text-ink-400 font-mono">
        <span className="size-2 rounded-full bg-accent-500" />
        <span>algorithm.js</span>
        <span className="ml-auto text-ink-500">
          {trace ? `step ${safeIdx + 1} / ${trace.length}` : 'idle'}
        </span>
      </div>

      <div ref={containerRef}>
        {html ? (
          <div dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <pre className="px-4 py-3 text-[13px] leading-[1.55] text-ink-300 font-mono whitespace-pre overflow-x-auto">
            {code}
          </pre>
        )}
      </div>

      <div className="border-t border-ink-800 px-4 py-3 min-h-[44px] text-[13px] text-ink-200">
        {note ? (
          <div className="flex items-start gap-3">
            <span className="text-accent-400 font-mono shrink-0">L{activeLine}</span>
            <span>{note}</span>
          </div>
        ) : (
          <div className="text-ink-500 italic">
            press a key in the demo above to step through this function
          </div>
        )}
      </div>

      {bindings.length > 0 && (
        <div className="border-t border-ink-800 px-4 py-3 flex flex-col gap-1 text-[13px] font-mono">
          <div className="text-[11px] uppercase tracking-[0.16em] text-ink-500 mb-1">scope</div>
          {bindings.map((b) => (
            <BindingRow key={b.name} binding={b} />
          ))}
        </div>
      )}
    </div>
  );
}

function BindingRow({ binding }: { binding: Binding }) {
  const labelColor =
    binding.kind === 'param'
      ? 'text-ink-400'
      : binding.kind === 'local'
        ? 'text-ink-300'
        : binding.kind === 'computed'
          ? 'text-accent-300'
          : 'text-emerald-300';
  return (
    <div className="flex items-baseline gap-3 animate-[scopeIn_220ms_ease-out]">
      <div className={`${labelColor} shrink-0 w-[200px] truncate`} title={binding.name}>
        {binding.name}
      </div>
      <div className="text-ink-100 break-all">{binding.value}</div>
    </div>
  );
}
