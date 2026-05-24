import { useEffect, useState } from 'react';
import { getHighlighter } from '../lib/highlighter';

type Props = {
  code: string;
  lang?: 'javascript' | 'typescript';
};

export function CodeBlock({ code, lang = 'javascript' }: Props) {
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getHighlighter().then((hl) => {
      if (cancelled) return;
      const out = hl.codeToHtml(code, {
        lang,
        theme: 'github-dark-dimmed',
      });
      setHtml(out);
    });
    return () => {
      cancelled = true;
    };
  }, [code, lang]);

  return (
    <div className="rounded-lg border border-ink-700 bg-ink-900/80 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-ink-700 text-xs text-ink-400 font-mono">
        <span className="size-2 rounded-full bg-ink-500" />
        <span>algorithm.js</span>
      </div>
      {html ? (
        <div dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <pre className="px-4 py-3 text-[13px] leading-[1.55] text-ink-300 font-mono whitespace-pre overflow-x-auto">
          {code}
        </pre>
      )}
    </div>
  );
}
