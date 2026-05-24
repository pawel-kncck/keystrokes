import type { AtomicFunction } from '../types';
import { CodeBlock } from './CodeBlock';

export function FunctionPage({ fn }: { fn: AtomicFunction }) {
  const { Demo } = fn;
  return (
    <article className="max-w-3xl mx-auto px-8 py-10 flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <div className="text-xs uppercase tracking-[0.18em] text-accent-500">atomic function</div>
        <h1 className="text-3xl font-semibold text-ink-50">{fn.title}</h1>
        <p className="text-ink-300 text-[15px] leading-relaxed">{fn.blurb}</p>
      </header>

      <section>
        <SectionLabel n={1} label="demo" />
        <Demo />
      </section>

      <section>
        <SectionLabel n={2} label="algorithm" />
        <div className="prose-invert text-ink-300 text-[15px] leading-relaxed flex flex-col gap-3">
          {fn.description}
        </div>
      </section>

      <section>
        <SectionLabel n={3} label="code" />
        <CodeBlock code={fn.code} />
      </section>
    </article>
  );
}

function SectionLabel({ n, label }: { n: number; label: string }) {
  return (
    <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-ink-400">
      <span className="inline-flex items-center justify-center size-5 rounded-full border border-ink-700 text-[10px]">
        {n}
      </span>
      {label}
    </div>
  );
}
