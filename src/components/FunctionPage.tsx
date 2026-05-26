import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { AtomicFunction } from '../types';
import { diff, type EditorState, type KeyEvent, type LastChange } from '../lib/editor';
import type { TraceStep } from '../lib/trace';
import { CodeBlock } from './CodeBlock';
import { SteppedCode } from './SteppedCode';
import { StepDemo } from './StepDemo';

const STEP_INTERVAL_MS = 650;

export function FunctionPage({ fn }: { fn: AtomicFunction }) {
  const { Demo } = fn;
  const canStep = Boolean(fn.trace && fn.reducer);
  const [stepMode, setStepMode] = useState(false);

  if (canStep && stepMode) {
    return <SteppedView fn={fn} onExit={() => setStepMode(false)} />;
  }

  return (
    <article className="max-w-3xl mx-auto px-8 py-10 flex flex-col gap-8">
      <PageHeader fn={fn} />

      <section>
        <SectionLabel n={1} label="demo" />
        <Demo />
      </section>

      <section>
        <SectionLabel n={2} label="algorithm" />
        <Prose>{fn.description}</Prose>
      </section>

      <section>
        <SectionLabel
          n={3}
          label="code"
          aside={
            canStep ? (
              <button
                type="button"
                onClick={() => setStepMode(true)}
                className="px-2.5 py-1 rounded border border-ink-700 text-ink-300 hover:border-accent-500/70 hover:text-accent-300 transition-colors normal-case tracking-normal"
              >
                step through →
              </button>
            ) : null
          }
        />
        <CodeBlock code={fn.code} />
      </section>
    </article>
  );
}

function SteppedView({ fn, onExit }: { fn: AtomicFunction; onExit: () => void }) {
  const traceFn = fn.trace!;
  const reducer = fn.reducer!;

  const initial = useMemo<EditorState>(
    () => ({
      text: fn.demoConfig?.text ?? '',
      cursor: fn.demoConfig?.cursor ?? (fn.demoConfig?.text?.length ?? 0),
    }),
    [fn.demoConfig],
  );

  const [demoState, setDemoState] = useState<EditorState>(initial);
  const [activeTrace, setActiveTrace] = useState<TraceStep[] | null>(null);
  const [stepIdx, setStepIdx] = useState(0);
  const [change, setChange] = useState<LastChange>({
    kind: 'noop',
    index: initial.cursor,
    token: 0,
  });
  const tokenRef = useRef(0);
  const timersRef = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const reset = useCallback(() => {
    clearTimers();
    setDemoState(initial);
    setActiveTrace(null);
    setStepIdx(0);
    setChange({ kind: 'noop', index: initial.cursor, token: 0 });
    tokenRef.current = 0;
  }, [clearTimers, initial]);

  const handleKey = useCallback(
    (e: KeyEvent) => {
      clearTimers();
      const next = reducer(demoState, e);
      const steps = traceFn(demoState, e);
      setActiveTrace(steps);
      setStepIdx(0);

      for (let i = 1; i < steps.length; i++) {
        const t = window.setTimeout(() => setStepIdx(i), STEP_INTERVAL_MS * i);
        timersRef.current.push(t);
      }
      if (next !== demoState) {
        const commitDelay = STEP_INTERVAL_MS * steps.length;
        const tCommit = window.setTimeout(() => {
          tokenRef.current += 1;
          setChange(diff(demoState, next, tokenRef.current));
          setDemoState(next);
        }, commitDelay);
        timersRef.current.push(tCommit);
      }
    },
    [clearTimers, demoState, reducer, traceFn],
  );

  return (
    <article className="max-w-3xl mx-auto px-8 py-10 flex flex-col gap-8">
      <PageHeader fn={fn} />

      <section>
        <SectionLabel n={1} label="demo" />
        <StepDemo
          state={demoState}
          change={change}
          hint={fn.demoConfig?.hint}
          onKey={handleKey}
          onReset={reset}
        />
      </section>

      <section>
        <SectionLabel n={2} label="algorithm" />
        <Prose>{fn.description}</Prose>
      </section>

      <section>
        <SectionLabel
          n={3}
          label="code"
          aside={
            <button
              type="button"
              onClick={onExit}
              className="px-2.5 py-1 rounded border border-accent-500/60 text-accent-300 hover:border-accent-400 transition-colors normal-case tracking-normal"
            >
              exit step mode
            </button>
          }
        />
        <SteppedCode code={fn.code} trace={activeTrace} stepIdx={stepIdx} />
      </section>
    </article>
  );
}

function PageHeader({ fn }: { fn: AtomicFunction }) {
  return (
    <header className="flex flex-col gap-2">
      <div className="text-xs uppercase tracking-[0.18em] text-accent-500">atomic function</div>
      <h1 className="text-3xl font-semibold text-ink-50">{fn.title}</h1>
      <p className="text-ink-300 text-[15px] leading-relaxed">{fn.blurb}</p>
    </header>
  );
}

function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="prose-invert text-ink-300 text-[15px] leading-relaxed flex flex-col gap-3">
      {children}
    </div>
  );
}

function SectionLabel({
  n,
  label,
  aside,
}: {
  n: number;
  label: string;
  aside?: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-ink-400">
      <span className="inline-flex items-center justify-center size-5 rounded-full border border-ink-700 text-[10px]">
        {n}
      </span>
      <span>{label}</span>
      {aside ? <span className="ml-auto">{aside}</span> : null}
    </div>
  );
}
