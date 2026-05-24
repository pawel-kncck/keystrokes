// Delete (forward) removes the character immediately *after* the cursor.
// The cursor stays put. At the end of the buffer it's a no-op.
export function deleteForward(state, event) {
  if (event.key !== 'Delete') return state;
  if (state.cursor >= state.text.length) return state;

  const { text, cursor } = state;

  return {
    text: text.slice(0, cursor) + text.slice(cursor + 1),
    cursor,
  };
}
