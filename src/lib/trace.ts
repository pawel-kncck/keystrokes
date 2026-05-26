import type { EditorState, KeyEvent } from './editor';

export type BindingKind = 'param' | 'local' | 'computed' | 'result';

export type Binding = {
  name: string;
  value: string;
  kind: BindingKind;
};

export type TraceStep = {
  /** 1-based source line that "runs" for this step */
  line: number;
  /** plain-language explanation shown under the code */
  note: string;
  /** bindings introduced (or recomputed) at this step */
  add?: Binding[];
  /** marks the terminating step (return) */
  done?: boolean;
};

export type TraceFn = (state: EditorState, event: KeyEvent) => TraceStep[];

const q = (s: string) => JSON.stringify(s);

export const traceInsertChar: TraceFn = (state, event) => {
  const steps: TraceStep[] = [];

  steps.push({
    line: 3,
    note: 'function called with the current state and the keystroke',
    add: [
      { name: 'state.text', value: q(state.text), kind: 'param' },
      { name: 'state.cursor', value: String(state.cursor), kind: 'param' },
      { name: 'event.key', value: q(event.key), kind: 'param' },
    ],
  });

  const hasMod = !!(event.metaKey || event.ctrlKey || event.altKey);
  steps.push({
    line: 4,
    note: hasMod
      ? 'a modifier (Cmd / Ctrl / Alt) is held — bail out, return state unchanged'
      : 'no Cmd / Ctrl / Alt held — continue',
    add: hasMod ? [{ name: '→ return', value: 'state (unchanged)', kind: 'result' }] : undefined,
    done: hasMod,
  });
  if (hasMod) return steps;

  const isSingle = event.key.length === 1;
  steps.push({
    line: 5,
    note: isSingle
      ? 'event.key is a single glyph — continue'
      : `event.key is a named key (${q(event.key)}, length ${event.key.length}) — bail out`,
    add: isSingle ? undefined : [{ name: '→ return', value: 'state (unchanged)', kind: 'result' }],
    done: !isSingle,
  });
  if (!isSingle) return steps;

  steps.push({
    line: 7,
    note: 'destructure state into local text and cursor',
    add: [
      { name: 'text', value: q(state.text), kind: 'local' },
      { name: 'cursor', value: String(state.cursor), kind: 'local' },
    ],
  });

  const before = state.text.slice(0, state.cursor);
  const after = state.text.slice(state.cursor);
  const newText = before + event.key + after;

  steps.push({
    line: 10,
    note: 'splice the key into the buffer at the cursor',
    add: [
      { name: 'text.slice(0, cursor)', value: q(before), kind: 'computed' },
      { name: 'event.key', value: q(event.key), kind: 'computed' },
      { name: 'text.slice(cursor)', value: q(after), kind: 'computed' },
      { name: 'new text', value: q(newText), kind: 'computed' },
    ],
  });

  steps.push({
    line: 11,
    note: 'advance the cursor by one',
    add: [{ name: 'new cursor', value: String(state.cursor + 1), kind: 'computed' }],
  });

  steps.push({
    line: 12,
    note: 'return the new state',
    add: [
      {
        name: '→ return',
        value: `{ text: ${q(newText)}, cursor: ${state.cursor + 1} }`,
        kind: 'result',
      },
    ],
    done: true,
  });

  return steps;
};
