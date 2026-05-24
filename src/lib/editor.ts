export type EditorState = {
  text: string;
  cursor: number;
};

export type ChangeKind = 'insert' | 'delete' | 'move' | 'noop';

export type LastChange = {
  kind: ChangeKind;
  /** index in the buffer the change happened at (post-change cursor for inserts) */
  index: number;
  /** character involved, when meaningful (insert/delete) */
  char?: string;
  /** monotonically increasing token so React can re-trigger animations */
  token: number;
};

export type KeyEvent = {
  key: string;
  shiftKey: boolean;
  metaKey: boolean;
  ctrlKey: boolean;
  altKey: boolean;
};

export type Reducer = (state: EditorState, e: KeyEvent) => EditorState;

export const initial: EditorState = { text: '', cursor: 0 };

/** Diff two states into a LastChange descriptor for visualization. */
export function diff(prev: EditorState, next: EditorState, token: number): LastChange {
  if (next.text.length > prev.text.length) {
    const i = next.cursor - 1;
    return { kind: 'insert', index: i, char: next.text[i], token };
  }
  if (next.text.length < prev.text.length) {
    const i = next.cursor;
    return { kind: 'delete', index: i, char: prev.text[i], token };
  }
  if (next.cursor !== prev.cursor) {
    return { kind: 'move', index: next.cursor, token };
  }
  return { kind: 'noop', index: next.cursor, token };
}
