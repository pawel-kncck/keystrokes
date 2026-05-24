import { createHighlighter, type Highlighter } from 'shiki';

let promise: Promise<Highlighter> | null = null;

export function getHighlighter(): Promise<Highlighter> {
  if (!promise) {
    promise = createHighlighter({
      themes: ['github-dark-dimmed'],
      langs: ['javascript', 'typescript'],
    });
  }
  return promise;
}
