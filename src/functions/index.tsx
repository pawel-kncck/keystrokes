import { EditorDemo } from '../components/EditorDemo';
import type { AtomicFunction, FunctionGroup } from '../types';
import { traceInsertChar } from '../lib/trace';

import { insertChar } from '../algorithms/insertChar.js';
import insertCharSource from '../algorithms/insertChar.js?raw';

import { backspace } from '../algorithms/backspace.js';
import backspaceSource from '../algorithms/backspace.js?raw';

import { deleteForward } from '../algorithms/deleteForward.js';
import deleteForwardSource from '../algorithms/deleteForward.js?raw';

import { moveCursor } from '../algorithms/moveCursor.js';
import moveCursorSource from '../algorithms/moveCursor.js?raw';

import { moveWord } from '../algorithms/moveWord.js';
import moveWordSource from '../algorithms/moveWord.js?raw';

import { typing } from '../algorithms/typing.js';
import typingSource from '../algorithms/typing.js?raw';

const FUNCTIONS: AtomicFunction[] = [
  {
    id: 'insert',
    title: 'Insert character',
    blurb:
      'The most basic write: take the keystroke, slot it into the buffer at the cursor, and shift the cursor one step right.',
    description: (
      <>
        <p>
          The text buffer is just a string. The cursor is an integer index into that string —
          it lives <em>between</em> characters, so valid positions go from <code>0</code> to{' '}
          <code>text.length</code> inclusive.
        </p>
        <p>
          Inserting splits the string at the cursor, drops the new character in the seam, and
          glues the pieces back together. The cursor then advances by one so the next insert
          lands after the character you just typed.
        </p>
        <p>
          We bail out on key combos (cmd, ctrl, alt) and on any "key" longer than one
          character — those are named keys like <code>"Backspace"</code>, not glyphs.
        </p>
      </>
    ),
    code: insertCharSource,
    Demo: () => (
      <EditorDemo
        reducer={insertChar}
        initialText="hello "
        hint="type any printable character — watch where it lands relative to the cursor"
      />
    ),
    trace: traceInsertChar,
    reducer: insertChar,
    demoConfig: {
      text: 'hello ',
      hint: 'type a printable char — each keystroke walks the code below',
    },
  },
  {
    id: 'backspace',
    title: 'Backspace',
    blurb: 'Delete the character before the cursor; pull the right-hand side leftward.',
    description: (
      <>
        <p>
          Backspace is the mirror of insert. It removes the character at index{' '}
          <code>cursor - 1</code> and decrements the cursor so the index keeps pointing at the
          same "seam" between characters.
        </p>
        <p>
          The only edge case worth handling is <code>cursor === 0</code>: there's nothing to the
          left, so we return the state unchanged.
        </p>
      </>
    ),
    code: backspaceSource,
    Demo: () => (
      <EditorDemo
        reducer={backspace}
        initialText="press backspace to chip away"
        hint="press Backspace — only Backspace does anything in this demo"
      />
    ),
  },
  {
    id: 'delete-forward',
    title: 'Delete (forward)',
    blurb: 'Delete the character after the cursor; cursor stays put.',
    description: (
      <>
        <p>
          Forward-delete (the <kbd>Delete</kbd> key, not <kbd>Backspace</kbd>) removes the
          character at <code>cursor</code> instead of <code>cursor - 1</code>. The cursor
          doesn't move — it now points at what was previously two characters to its right.
        </p>
        <p>
          Edge case: when the cursor is already at <code>text.length</code> there's nothing to
          delete, so we no-op.
        </p>
      </>
    ),
    code: deleteForwardSource,
    Demo: () => (
      <EditorDemo
        reducer={deleteForward}
        initialText="press Delete (fn+⌫ on mac) to remove what's ahead"
        initialCursor={6}
        hint="press Delete (fn+Backspace on mac) — Backspace is ignored here"
      />
    ),
  },
  {
    id: 'cursor-move',
    title: 'Cursor movement',
    blurb: 'Slide the cursor one step at a time without touching the buffer.',
    description: (
      <>
        <p>
          Movement keys never mutate the text — they only change the cursor index. <code>ArrowLeft</code>{' '}
          subtracts one (clamped at <code>0</code>); <code>ArrowRight</code> adds one (clamped at{' '}
          <code>text.length</code>). <code>Home</code> and <code>End</code> jump to either edge.
        </p>
        <p>
          Clamping is the whole game: an off-by-one here lets the cursor "fall off" the buffer
          and every subsequent insert/delete will start producing garbage.
        </p>
      </>
    ),
    code: moveCursorSource,
    Demo: () => (
      <EditorDemo
        reducer={moveCursor}
        initialText="use the arrow keys, home, and end"
        initialCursor={0}
        hint="arrow keys / Home / End move the cursor — characters won't change"
      />
    ),
  },
  {
    id: 'word-move',
    title: 'Word-wise movement',
    blurb: 'Skip whole words at a time — hold alt/option and press an arrow key.',
    description: (
      <>
        <p>
          A "word" here is a maximal run of <code>\w</code> characters (letters, digits,
          underscore). Everything else — spaces, punctuation — is a boundary.
        </p>
        <p>
          To find the next boundary we walk in the chosen direction, first skipping the run of
          non-word characters under us, then skipping the run of word characters. Where we
          stop is the new cursor position.
        </p>
        <p>
          Most editors implement this iteratively rather than via a regex match so the same
          loop works for both directions with a single sign flip.
        </p>
      </>
    ),
    code: moveWordSource,
    Demo: () => (
      <EditorDemo
        reducer={moveWord}
        initialText="hop across these words with alt+arrows"
        initialCursor={0}
        hint="hold Alt/Option + ArrowLeft / ArrowRight"
      />
    ),
  },
  {
    id: 'typing',
    title: 'Typing (everything together)',
    blurb: 'All of the above wired into a single reducer — type freely.',
    description: (
      <>
        <p>
          A real editor's keystroke handler is just a switch over these atomic operations.
          This combined reducer dispatches by key: arrows move the cursor, Backspace/Delete
          remove characters, and any single printable key inserts at the cursor.
        </p>
        <p>
          Notice that nothing is shared mutable state — every keystroke is{' '}
          <code>(state, event) =&gt; newState</code>. That's what makes undo/redo trivial to add
          later: keep the previous state instead of throwing it away.
        </p>
      </>
    ),
    code: typingSource,
    Demo: () => (
      <EditorDemo
        reducer={typing}
        initialText="type, backspace, arrow — everything works"
        hint="type, arrow around, backspace, delete — the full minimal editor"
      />
    ),
  },
];

export const GROUPS: FunctionGroup[] = [
  {
    id: 'writing',
    label: 'Writing',
    items: FUNCTIONS.filter((f) =>
      ['insert', 'backspace', 'delete-forward'].includes(f.id),
    ),
  },
  {
    id: 'cursor',
    label: 'Cursor',
    items: FUNCTIONS.filter((f) => ['cursor-move', 'word-move'].includes(f.id)),
  },
  {
    id: 'combined',
    label: 'Combined',
    items: FUNCTIONS.filter((f) => f.id === 'typing'),
  },
];

export const FUNCTIONS_BY_ID: Record<string, AtomicFunction> = Object.fromEntries(
  FUNCTIONS.map((f) => [f.id, f]),
);
